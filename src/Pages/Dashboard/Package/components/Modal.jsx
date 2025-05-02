import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ModalUploadFiles = ({
  isModalOpen,
  contentLabel,
  id,
  onClose,
  children,
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      closeTimeoutMS={50}
      contentLabel={contentLabel}
      //   onRequestClose={isModalOpen}
      id={id}
      shouldCloseOnOverlayClick={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "0px",
          borderRadius: "8px",
          border: 0,
        },
      }}
    >
      {children}
    </Modal>
  );
};

export default React.memo(ModalUploadFiles);
