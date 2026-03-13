const AsyncState = ({
  title = 'Something went wrong',
  message = 'Please try again.',
  actionLabel = 'Retry',
  onAction
}) => {
  return (
    <div className="async-state-card" role="alert">
      <h3>{title}</h3>
      <p>{message}</p>
      {onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default AsyncState;
