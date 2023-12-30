import Modal from 'react-modal';
import React from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";

const CustomModal = ({ isOpen, onRequestClose, children }) => {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius:8,
      width:"80%"
    },
  };

  return (
    <Modal style={customStyles} isOpen={isOpen} onRequestClose={onRequestClose}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"flex-end", padding:10}}>
          <button onClick={onRequestClose} >
            <IoMdCloseCircleOutline size={35}/>
          </button>
      </div>
      
      {children}
    </Modal>
  );
};

export default CustomModal;
