import React, { useEffect, useState } from "react";
import { auth } from "config/firebase";

import { useAuthContext } from "contexts/AuthContext";

import "../../../App.scss";
import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  message,
  ColorPicker,
  Select,
} from "antd";
import { PlusOutlined, DeleteFilled, EditFilled } from "@ant-design/icons";

import { firestore } from "config/firebase";
// import { Scrollbars } from "react-custom-scrollbars";
import dayjs from "dayjs";

import { theme } from "antd";
import Title from "antd/es/skeleton/Title";

const initialValue = {
  title: "",
  location: "",
  listName: "",
  description: "",
  date: "",
};

// const [selectedListName, setSelectedListName] = useState("Personal");

export default function StickyWall() {
  const { user } = useAuthContext();
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [selectedTodoList, setSelectedTodoList] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [state, setState] = useState(initialValue);
  const [allDocuments, setAllDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [lists, setLists] = useState([
    { name: "Personal", color: "#FF6B69" },
    { name: "Work", color: "#67D8E9" },
  ]);
  const [updatedDate, setUpdatedDate] = useState(
    selectedTodo && selectedTodo.date
      ? dayjs(selectedTodo.date).format("YYYY-MM-DD")
      : ""
  );
  const [updatedColor, setUpdatedColor] = useState(
    selectedTodo && selectedTodo.bgColor ? selectedTodo.bgColor.toString() : ""
  );

  const [selectedList, setSelectedList] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  useEffect(() => {
    // Fetch lists data from Firebase
    const fetchLists = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "lists"));
        const fetchedLists = querySnapshot.docs.map((doc) => doc.data());
        setLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchLists();
  }, []);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleTodoFieldChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e; // Extract the value or use directly
    setSelectedTodo((prevTodo) => ({
      ...prevTodo,
      [fieldName]: value,
      date: updatedDate,
    }));
  };

  const handleDate = (_, date) => setState((s) => ({ ...s, date }));
  // Add Todo Function  //

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedList) {
      message.error("Please select a list for the Todo");
      return;
    }
    if (
      state.title === "" ||
      state.location === "" ||
      state.date === "" ||
      state.description === ""
    ) {
      message.error("Please fill all fields.");
      return;
    }

    const todo = {
      title: state.title,
      location: state.location,
      listName: selectedTodoList,
      description: state.description,
      date: state.date,
      dateCreated: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      bgColor: selectedColor,
      createdBy: {
        fullName: user.fullName,
        email: user.email,
        uid: user.uid,
      },
    };

    console.log("todo", todo);

    try {
      console.log("Adding todo:", todo);
      await setDoc(doc(firestore, "todos", todo.id), todo);
      message.success("Add Todo Successfully.");
      setOpenModal(false); // Close the modal after submitting
      setState(initialValue); // Reset the state to initialValue
    } catch (error) {
      console.error("Error adding todo:", error);
      message.error("Something Went Wrong While Adding Todo");
    }
  };

  // Read Todo
  // const getTodo = async () => {
  //   try {
  //     const querySnapshot = await getDocs(
  //       collection(firestore, "todos"), // Use collection directly
  //       where("createdBy.uid", "==", user.uid)
  //     );

  //     const array = querySnapshot.docs.map((doc) => doc.data());
  //     setDocuments(array);
  //     setAllDocuments(array);
  //   } catch (error) {
  //     console.error("Error fetching todos:", error);
  //   }
  // };

  // useEffect(() => {
  //   getTodo();
  // }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "todos"),
      (querySnapshot) => {
        const array = querySnapshot.docs.map((doc) => doc.data());
        setDocuments(array);
        setAllDocuments(array);
      }
    );

    return () => {
      unsubscribe(); // Cleanup the listener when component unmounts
    };
  }, []);
  // Edit Todo
  const handleEdit = (todo) => {
    console.log("Selected Todo", todo);
    const bgColorString = todo.bgColor ? todo.bgColor.toString() : "";
    setSelectedTodo({
      id: todo.id,
      title: todo.title,
      location: todo.location,
      date: todo.date ? new Date(todo.date) : null,
      description: todo.description,
      listName: todo.listName,
      bgColor: bgColorString,
      // Include other properties that are part of the todo object
    });
    setUpdatedDate(todo.date ? dayjs(todo.date).format("YYYY-MM-DD") : ""); // Set initial date value
    setSelectedColor(bgColorString);
    setSelectedList(selectedTodo ? selectedTodo.listName : "");
    setOpenUpdateModal(true);
  };

  // const handleUpdate = async () => {
  //   if (!selectedTodo || !selectedTodo.id) {
  //     console.error("Invalid selectedTodo or id");
  //     return;
  //   }
  //   console.log("Updating todo with ID:", selectedTodo.id);

  //   const { title, location, description, listName } = selectedTodo;

  //   if (!title) {
  //     message.error("Please enter title");
  //     return;
  //   }

  //   // Convert the color value to a string (e.g., hex or rgba)
  //   const bgColorString = selectedTodo.bgColor.toString();
  //   const updatedTodo = {
  //     title,
  //     location,
  //     date: selectedTodo.date,
  //     description,
  //     listName,
  //     bgColor: bgColorString, // Use the converted string value
  //     dateModified: new Date().getTime(),
  //   };

  //   try {
  //     // Update the Firestore document
  //     await setDoc(doc(firestore, "todos", selectedTodo.id), updatedTodo);

  //     const updatedTodos = documents.map((oldTodo) => {
  //       if (oldTodo.id === selectedTodo.id) return updatedTodo;
  //       return oldTodo;
  //     });
  //     console.log("Updated Todo", updatedTodos);
  //     setDocuments(updatedTodos);
  //     setAllDocuments(updatedTodos);
  //     localStorage.setItem("todos", JSON.stringify(updatedTodos));
  //     message.success("Todo updated successfully");
  //     setOpenUpdateModal(false);
  //   } catch (error) {
  //     console.error("Error updating todo:", error);
  //     message.error("Something went wrong while updating the todo");
  //   }
  // };
  const handleUpdate = async () => {
    if (!selectedTodo || !selectedTodo.id) {
      console.error("Invalid selectedTodo or id");
      return;
    }
    console.log("Updating todo with ID:", selectedTodo.id);

    const { title, location, description, listName } = selectedTodo;

    if (!title) {
      message.error("Please enter title");
      return;
    }

    // Convert the color value to a valid string representation (e.g., hex or rgba)
    const bgColorString = selectedTodo.bgColor.toString();

    const updatedTodo = {
      title,
      location,
      date: selectedTodo.date,
      description,
      listName,
      bgColor: bgColorString, // Use the converted string value
      dateModified: new Date().getTime(),
    };

    try {
      // Update the Firestore document
      await setDoc(doc(firestore, "todos", selectedTodo.id), updatedTodo);

      const updatedTodos = documents.map((oldTodo) => {
        if (oldTodo.id === selectedTodo.id) return updatedTodo;
        return oldTodo;
      });
      console.log("Updated Todo", updatedTodos);
      setDocuments(updatedTodos);
      setAllDocuments(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      message.success("Todo updated successfully");
      setOpenUpdateModal(false);
    } catch (error) {
      console.error("Error updating todo:", error);
      message.error("Something went wrong while updating the todo");
    }
  };

  // Delete Todo
  const handleDelete = async (todoToDelete) => {
    try {
      await deleteDoc(doc(firestore, "todos", todoToDelete.id));
      const updatedDocuments = documents.filter(
        (todo) => todo.id !== todoToDelete.id
      );
      setDocuments(updatedDocuments);
      setAllDocuments(updatedDocuments);
      message.success("Todo Deleted Successfully.");
    } catch (error) {
      message.error("Something went wrong while deleting the Todo");
      console.log("Error:", error);
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      {/* <Todos /> */}
      <div className="container">
        <div className="row">
          {documents.map((todo, i) => {
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
                      <DeleteFilled onClick={() => handleDelete(todo)} />
                      <EditFilled onClick={() => handleEdit(todo)} />
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

          <div
            className="col-12 col-md-6 col-lg-4"
            id="card"
            onClick={() => {
              setOpenModal(true);
              setState(initialValue); // Reset state when opening modal
              setSelectedList(""); // Reset selected list when opening modal
              setSelectedColor(""); // Reset selected color when opening modal
            }}
            style={{
              cursor: "pointer",
            }}
          >
            <div
              className="plusbox my-3 mx-sm-0 mx-md-0 mx-lg-3"
              style={{
                backgroundColor: "#adb5bd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                id="pluseCard"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PlusOutlined />
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Add Todo"
        style={{
          top: 20,
        }}
        open={openModal}
        onOk={handleSubmit}
        onCancel={() => {
          setOpenModal(false);
          setSelectedList(""); // Reset the selected list when cancelling
        }}
      >
        <div className="card p-3 p-md-4">
          <Title level={2} className="m-0 text-center">
            Add Todo
          </Title>

          <Form layout="vertical">
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Form.Item label="Title">
                  <Input
                    placeholder="Input your title"
                    name="title"
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item label="Location">
                  <Input
                    placeholder="Input your location"
                    name="location"
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item label="Date">
                  <DatePicker className="w-100" onChange={handleDate} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item label="List">
                  <Select
                    placeholder="Select a list"
                    onChange={(value) => setSelectedList(value)}
                    value={selectedList}
                  >
                    {lists.map((list) => (
                      <Select.Option key={list.name} value={list.name}>
                        {list.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Description">
                  <Input.TextArea
                    placeholder="Input your description"
                    name="description"
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item label="Background Color">
                  <ColorPicker
                    value={selectedColor}
                    onChange={(e, color) => setSelectedColor(color)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
      <Modal
        title="Update Todo"
        centered
        open={openUpdateModal}
        onOk={handleUpdate}
        okText="Confirm"
        cancelText="Close"
        onCancel={() => setOpenUpdateModal(false)}
        style={{ width: 1000, maxWidth: 1000 }}
      >
        <Form layout="vertical" className="py-4">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item label="Title">
                <Input
                  placeholder="Input your title"
                  name="title"
                  value={selectedTodo ? selectedTodo.title : ""}
                  onChange={(e) => handleTodoFieldChange(e, "title")}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Location">
                <Input
                  placeholder="Input your location"
                  name="location"
                  value={selectedTodo ? selectedTodo.location : ""}
                  onChange={(e) => handleTodoFieldChange(e, "location")}
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item label="Date">
                <DatePicker
                  className="w-100"
                  value={updatedDate ? dayjs(updatedDate) : null}
                  onChange={(newDate) =>
                    setUpdatedDate(newDate.format("YYYY-MM-DD"))
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item label="List">
                <Select
                  placeholder="Select a list"
                  onChange={(value) => setSelectedList(value)}
                  value={selectedList}
                >
                  {lists.map((list) => (
                    <Select.Option key={list.name} value={list.name}>
                      {list.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Description" className="mb-0">
                <Input.TextArea
                  placeholder="Input your description"
                  name="description"
                  value={selectedTodo ? selectedTodo.description : ""}
                  onChange={(e) => handleTodoFieldChange(e, "description")}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Background Color">
                <ColorPicker
                  value={selectedTodo ? selectedTodo.bgColor : ""}
                  // onChange={(color) => handleTodoFieldChange(color, "bgColor")}
                  onChange={(e, color) => setSelectedColor(color)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
