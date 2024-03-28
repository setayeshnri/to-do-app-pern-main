import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import { ToastContainer } from "react-toastify";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const user = cookies.User;
  const [tasks, setTasks] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}todos/users/${user.id}`
      );
      const res = await response.json();

      setTasks(res.data.todos);
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, []);

  const sortedTasks = tasks?.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <ToastContainer />
      {authToken ? (
        <div className="app">
          <ListHeader getData={getData} />
          {sortedTasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
