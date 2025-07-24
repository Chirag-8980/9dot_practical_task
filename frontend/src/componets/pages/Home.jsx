import React, { use, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getTasks } from "../../redux/slice/taskSlice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  return <div>Home</div>;
};

export default Home;
