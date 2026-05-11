const CommentMarker = ({ timestamp, duration, onClick, isResolved }) => {
  const position = (timestamp / duration) * 100;

  return (
    <div
      className={`comment-marker ${isResolved ? 'opacity-50' : ''}`}
      style={{ left: `${position}%` }}
      onClick={onClick}
      title={`Comment at ${Math.floor(timestamp)}s`}
    />
  );
};

export default CommentMarker;
