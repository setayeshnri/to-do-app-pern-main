import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const Modal = ({ mode, setShowModal, getData, task }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const editMode = mode === "edit" ? true : false;
  const [data, setData] = useState({
    user_id: editMode ? task.user_id : cookies.UserId,
    title: editMode ? task.title : "",
    progress: editMode ? task.progress : 50,
    data: editMode ? task.date : new Date(),
  });

  const postData = async (e) => {
    e.preventDefault();
    if (data.title === null || data.title?.trim().length === 0) {
      return toast.error("Task is required");
    }
    try {
      console.log("auth token >>>", cookies.AuthToken);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}todos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: cookies.AuthToken,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 201) {
        setShowModal(false);
        getData();
        toast.success("Todo saved");
      } else toast.error("Failed to update todo");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    if (data.title === null || data.title?.trim().length === 0) {
      return toast.error("Task is required");
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}todos/${task.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: cookies.AuthToken,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        setShowModal(false);
        getData();
        toast.success("Todo updated");
      } else toast.error("Failed to update todo");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };
  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your tasks</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <form method="POST">
          <input
            required
            maxLength={30}
            placeholder="Write your task here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="range">Drag to select your current progress</label>
          <input
            required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <input
            className={mode}
            type="submit"
            value="save"
            onClick={editMode ? editData : postData}
          />
        </form>
      </div>
    </div>
  );
};

export default Modal;
