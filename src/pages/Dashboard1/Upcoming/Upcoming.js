// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from "react";
// import { UesDoxContext } from "../../../contexts/DoxContext";
// import dayjs from "dayjs";
// import { Divider } from "antd";

// export default function Upcoming() {
//   const { documents } = UesDoxContext();
//   const [show, setShow] = useState(true);
//   const [date, setDate] = useState("");
//   const [todayDoc, setTodayDoc] = useState([]);

//   useEffect(() => {
//     let dat = dayjs().format("YYYY-MM-DD");
//     setDate(dat);
//   }, []);

//   const getFun = () => {
//     let today = [];
//     // eslint-disable-next-line array-callback-return
//     today = documents.filter((doc) => {
//       if (doc.startDate > date) {
//         return doc;
//       }
//     });
//     setTodayDoc(today);
//     setShow(false);
//   };

//   useEffect(() => {
//     getFun();
//   }, [show]);
//   return (
//     <>
//       <div className="container">
//         <div className="row">
//           {/* {show ? <button className='btn btn-primary text-white' onClick={getFun} >Show Task</button> : <div></div>} */}
//           <h1>Upcoming</h1>
//           {todayDoc.map((doc, i) => {
//             return (
//               <>
//                 <div className="col-12 col-md-6 col-lg-4 " key={i}>
//                   <div
//                     className="box my-3 mx-sm-0 mx-md-0 mx-lg-3"
//                     style={{ backgroundColor: `${doc.bgColor}` }}
//                   >
//                     <h3 className="text-center">{i + 1}</h3>
//                     <Divider className="m-0 p-0" />

//                     <h4>{doc.title}</h4>
//                     <p>{doc.description}</p>
//                     <p>
//                       <b>Date :</b>
//                       {doc.startDate} <b> To </b> {doc.endDate}
//                     </p>
//                     <p>
//                       <b>Email :</b> {doc.createdBy.email}
//                     </p>
//                     <p>
//                       <b>List :</b> {doc.lists}
//                     </p>
//                     <p>
//                       <b>ID :</b> {doc.randumId}
//                     </p>
//                     <p>
//                       <b>BgColor :</b> {doc.bgColor}
//                     </p>
//                   </div>
//                 </div>
//               </>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import { UesDoxContext } from "../../../contexts/DoxContext";
import dayjs from "dayjs";
import { Divider } from "antd";

export default function Upcoming() {
  const { documents } = UesDoxContext();
  const [date, setDate] = useState("");
  const [show, setShow] = useState(true);
  const [upcomingDoc, setUpcomingDoc] = useState([]);
  useEffect(() => {
    const currentDate = dayjs().format("YYYY-MM-DD");
    setDate(currentDate);
  }, []);

  // useEffect(() => {
  //   const upcoming = documents.filter((doc) => {
  //     return doc.startDate > date;
  //   });

  //   console.log("🚀 ~ file: Upcoming.js:96 ~ upcoming ~ upcoming:", upcoming);

  //   setUpcomingDoc(upcoming);
  // }, [documents, date]);
  const getFun = () => {
    let today = [];
    // eslint-disable-next-line array-callback-return
    today = documents.filter((todo) => {
      // eslint-disable-next-line eqeqeq
      if (todo.date > date) {
        return todo;
      }
    });
    setUpcomingDoc(today);
    setShow(false);
  };

  useEffect(() => {
    getFun();
  }, [show]);

  return (
    <div className="container">
      <div className="row">
        <h1>Upcoming</h1>
        {upcomingDoc.map((doc, i) => (
          <div className="col-12 col-md-6 col-lg-4" key={i}>
            <div
              className="box my-3 mx-sm-0 mx-md-0 mx-lg-3"
              style={{
                backgroundColor: doc.bgColor,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid dark",
                borderRadius: 5,
                position: "relative",
              }}
            >
              <h4>Title</h4>
              <span style={{ fontSize: "large" }}>{doc.title}</span>
              <h4>Location</h4>
              <span style={{ fontSize: "large" }}>{doc.location}</span>
              <h4>Description</h4>
              <span style={{ fontSize: "large" }}>{doc.description}</span>
              <div style={{ position: "", bottom: 0, left: 0 }}>
                <p>
                  {doc.date ? dayjs(doc.date).format("dddd, DD/MM/YYYY") : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
