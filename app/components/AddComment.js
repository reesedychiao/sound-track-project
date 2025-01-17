import React from "react";

const AddComment = ({ date, userId, songId, myUsername, onCommentAdded }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const comment = formData.get("comment");
    const response = await fetch("/api/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date,
        userId: userId,
        songId: songId,
        comment: comment,
        myUsername: myUsername,
      }),
    });
    if (!response.ok) {
      alert("Could not save comment...");
      return;
    }
    await onCommentAdded();
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md max-h-96 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Comment</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="comment"
            name="comment"
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm"
          ></input>
          <button
            type="submit"
            className="text-white py-2 px-4 rounded bg-brown text-cream hover:font-bold mt-4"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddComment;
