import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import crypto from "crypto";
import SHA256 from "crypto-js/sha256";
import Session from "../models/Session";

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15;
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2;

const fromSessionTokenToSessionId = (sessionToken) => {
  const hash = SHA256(sessionToken);
  const hexString = hash.toString();
  const id = encodeHexLowerCase(hexString);
  return id;
};

export const generateRandomSessionToken = () => {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
};

export const createSession = async (sessionToken, userId) => {
  const sessionId = fromSessionTokenToSessionId(sessionToken);

  const session = new Session({
    id: sessionId,
    expireDate: new Date(Date.now() + SESSION_MAX_DURATION_MS),
    userId,
  });

  await session.save();

  return session;
};

export const validateSession = async (sessionToken) => {
  const sessionId = fromSessionTokenToSessionId(sessionToken);

  const result = await Session.findOne({ id: sessionId }).populate("userId");

  if (!result) {
    return { session: null, user: null };
  }

  const { userId: user, ...session } = result._doc;

  if (Date.now() >= session.expireDate.getTime()) {
    await Session.deleteOne({ id: sessionId });
    return { session: null, user: null };
  }

  if (
    Date.now() >=
    session.expireDate.getTime() - SESSION_REFRESH_INTERVAL_MS
  ) {
    session.expireDate = new Date(Date.now() + SESSION_MAX_DURATION_MS);
    await Session.updateOne(
      { id: sessionId },
      { expireDate: session.expireDate }
    );
  }

  return { session, user };
};
