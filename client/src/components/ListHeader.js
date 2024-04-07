import React, { useState } from "react";
import Modal from "./Modal";
import { useCookies } from "react-cookie";
import logomini from "../logo_mini.png";

const ListHeader = ({ getData, clearData }) => {
  const [showModal, setShowModal] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const signOut = () => {
    removeCookie("Username");
    removeCookie("AuthToken");
    removeCookie("UserId");
    clearData();
  };
  return (
    <div className="list-header">
      <img className="mini_logo" src={logomini} alt="TaskZilla mini logo" />

      <div className="button-container" style={{ marginRight: "-9%" }}>
        <button className="create" onClick={() => setShowModal(true)}>
          ADD NEW
        </button>
        <button className="signout" onClick={signOut}>
          SIGN OUT {cookies && `(${cookies?.Username})`}
        </button>
      </div>
      {showModal && (
        <Modal mode={"create"} setShowModal={setShowModal} getData={getData} />
      )}
    </div>
  );
};

export default ListHeader;
