/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { UesDoxContext } from "../../../contexts/DoxContext";
import dayjs from "dayjs";
import { Divider } from "antd";

export default function Today() {
  const { documents } = UesDoxContext();
  const [show, setShow] = useState(true);
  const [date, setDate] = useState("");
  const [todayDoc, setTodayDoc] = useState([]);

  useEffect(() => {
    let dat = dayjs().format("YYYY-MM-DD");
    setDate(dat);
  }, []);

  const getFun = () => {
    let today = [];
    // eslint-disable-next-line array-callback-return
    today = documents.filter((todo) => {
      // eslint-disable-next-line eqeqeq
      if (todo.date == date) {
        return todo;
      }
    });
    setTodayDoc(today);
    setShow(false);
  };

  useEffect(() => {
    getFun();
  }, [show]);
  return (
    <>
      <div className="container">
        <div className="row">
          {/* {show ? <button className='btn btn-primary text-white' onClick={getFun} >Show Task</button> : <div></div>} */}
          <h1>Today</h1>

          {todayDoc.map((todo, i) => {
            return (
              <>
                <div className="col-12 col-md-6 col-lg-4" id="card" key={i}>
                  <div
                    className="box my-3 mx-sm-0 mx-md-0 mx-lg-3"
                    style={{
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: todo.bgColor,
                      border: "1px solid dark",
                      borderRadius: 5,
                      position: "relative",
                    }}
                  >
                    <h4>Title</h4>
                    <span style={{ fontSize: "large" }}>{todo.title}</span>
                    <h4>Location</h4>
                    <span style={{ fontSize: "large" }}>{todo.location}</span>
                    <span
                      className="p-1"
                      id="deleteIcon"
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        display: "flex",
                        gap: "5px",
                      }}
                    >
                      {/* <DeleteFilled onClick={() => handleDelete(todo)} />
                      <EditFilled onClick={() => handleEdit(todo)} /> */}
                    </span>
                    <h4>Description</h4>
                    <span style={{ fontSize: "large" }}>
                      {todo.description}
                    </span>
                    <div style={{ position: "", bottom: 0, left: 0 }}>
                      <p>
                        {todo.date
                          ? dayjs(todo.date).format("dddd, DD/MM/YYYY")
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
