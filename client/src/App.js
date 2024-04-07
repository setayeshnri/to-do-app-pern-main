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
  const [tasks, setTasks] = useState([]);

  const getData = async () => {
    if (!cookies.UserId) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}todos/users/${cookies.UserId}`,
        {
          headers: {
            Authorization: cookies.AuthToken,
          },
        }
      );
      const res = await response.json();
      setTasks(res.data.todos);
      return res;
    } catch (error) {}
  };

  const clearData = () => setTasks([]);

  useEffect(() => {
    getData();
  }, [cookies]);

  const sortedTasks = tasks?.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <ToastContainer />
      {authToken ? (
        <div className="app">
          <ListHeader getData={getData} clearData={clearData} />
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
