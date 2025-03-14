import React from "react";

function ConfirmBox({ open, closeDialog, title, empID, deleteFunction }) {
  if (!open) return null; // Prevents rendering when modal is closed

  return (
    <div className="modal is-active">
      {/* Background Blur */}
      <div className="modal-background" onClick={closeDialog}></div>

      <div
        className="modal-card"
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        {/* Header */}
        <header
          className="modal-card-head has-background-light"
          style={{ borderBottom: "none" }}
        >
          <p className="modal-card-title has-text-weight-semibold">
            {title || "Confirm Action"}
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={closeDialog}
          ></button>
        </header>

        {/* Body */}
        <section
          className="modal-card-body"
          style={{ fontSize: "1rem", color: "#4a4a4a" }}
        >
          <p>
            Are you sure you want to delete{" "}
            <strong>{title || "NO EMPLOYEE"}</strong> with Employee ID:{" "}
            <strong>{empID || "NO ID"}</strong>?
          </p>
        </section>

        {/* Footer */}
        <footer
          className="modal-card-foot is-flex is-justify-content-flex-end has-background-light"
          style={{ borderTop: "none" }}
        >
          <button
            className="button is-light"
            onClick={closeDialog}
            style={{ borderRadius: "8px" }}
          >
            Cancel
          </button>
          <button
            className="button is-danger"
            onClick={deleteFunction}
            style={{ borderRadius: "8px" }}
          >
            Delete
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ConfirmBox;
