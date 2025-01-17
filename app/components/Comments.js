import React from "react";
import { useState, useEffect } from "react";

const Comments = ({ date, userId, songId }) => {
  const [comments, setComments] = useState([]);

  const getComments = async () => {
    try {
      const response = await fetch("/api/getComments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, userId, songId }),
      });
      if (!response.ok) {
        alert("Could not get comments...");
        return;
      }
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
  }, [userId, songId]);

  return (
    <div className="mx-8 items-start text-left">
      <h1 className="text-3xl font-semibold mb-4">Comments</h1>
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index}>
              <div>
                <div className="text-lg font-semibold">{comment.username}</div>
                <div>
                  <p>{comment.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No comments yet...</p>
      )}
    </div>
  );
};

export default Comments;
