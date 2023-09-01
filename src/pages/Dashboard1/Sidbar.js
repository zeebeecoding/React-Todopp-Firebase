import React, { useEffect, useState } from "react";
import {
  DoubleRightOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  FileAddOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  DeleteFilled,
  EditFilled,
  MenuOutlined,
} from "@ant-design/icons";
import { FaSignOutAlt } from "react-icons/fa";

import {
  Layout,
  Menu,
  Button,
  theme,
  Divider,
  message,
  Input,
  ColorPicker,
  Modal,
  Form,
  Row,
  Col,
} from "antd";

import { Link } from "react-router-dom";
import Routes from "./Routes";
import { signOut } from "firebase/auth";
import { useAuthContext } from "../../contexts/AuthContext";
import { auth, firestore } from "../../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
const { Header, Sider, Content } = Layout;
// const { Search } = Input;
export default function Sidbar({ listsProp }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // const { isAuth, user, dispatch } = useAuthContext();
  const { dispatch } = useAuthContext();
  const [editListId, setEditListId] = useState(null);
  const [editedListName, setEditedListName] = useState("");
  const [editedListColor, setEditedListColor] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("4");
  const [openListModal, setOpenListModal] = useState(false);
  const [listName, setListName] = useState("");
  const [selectedListColor, setSelectedListColor] = useState("");
  const [lists, setLists] = useState(listsProp);
  const [isDuplicateList, setIsDuplicateList] = useState(false);
  const handleAddList = () => {
    setOpenListModal(true);
  };
  const handleListNameChange = (e) => {
    setListName(e.target.value);
  };

  const handleListColorChange = (e, color) => {
    setSelectedListColor(color);
  };
  useEffect(() => {
    const addDefaultLists = async () => {
      const defaultListNames = ["Personal", "Work"];

      const existingLists = await getDocs(collection(firestore, "lists"));
      const existingListNames = existingLists.docs.map(
        (doc) => doc.data().name
      );

      const listsToAdd = defaultListNames.filter(
        (listName) => !existingListNames.includes(listName)
      );

      for (const listName of listsToAdd) {
        const newList = { name: listName, color: "#000000" };
        try {
          await addDoc(collection(firestore, "lists"), newList);
        } catch (error) {
          console.error("Error adding default list:", error);
        }
      }
    };

    addDefaultLists(); // Call the function to add default lists

    const unsubscribe = onSnapshot(
      collection(firestore, "lists"),
      (snapshot) => {
        const newLists = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLists(newLists);
      }
    );

    return () => unsubscribe();
  }, []);
  const handleListSubmit = async () => {
    if (listName && selectedListColor) {
      if (lists.some((list) => list.name === listName)) {
        setIsDuplicateList(true);
        return;
      }
      const newList = {
        name: listName,
        color: selectedListColor,
      };
      try {
        await addDoc(collection(firestore, "lists"), newList);
        message.success("List added successfully");
        setListName("");
        setSelectedListColor("");
        setIsDuplicateList(false);
        setOpenListModal(false); // Close the modal
      } catch (error) {
        console.error("Error adding list:", error);
        message.error("Something went wrong while adding the list");
      }
    }
  };

  const handleEditList = (list) => {
    setEditListId(list.id);
    setEditedListName(list.name);
    setEditedListColor(list.color);
  };
  const handleSaveEdit = async () => {
    if (editListId && editedListName && editedListColor) {
      try {
        // Update the list in Firestore
        await updateDoc(doc(firestore, "lists", editListId), {
          name: editedListName,
          color: editedListColor,
        });

        // Update the lists state with the edited list
        setLists((prevLists) =>
          prevLists.map((list) =>
            list.id === editListId
              ? { ...list, name: editedListName, color: editedListColor }
              : list
          )
        );

        // Reset the edit state
        setEditListId(null);
        setEditedListName("");
        setEditedListColor("");
      } catch (error) {
        console.error("Error updating list:", error);
      }
    }
  };
  const handleDeleteList = async (listId) => {
    try {
      // Delete the list from Firestore
      await deleteDoc(doc(firestore, "lists", listId));

      // Update the lists state by removing the deleted list
      setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        message.success("Signout successful");
        dispatch({ type: "SET_LOGGED_OUT" });
      })
      .catch((err) => {
        message.error("Signout not successful");
      });
  };

  return (
    <Layout id="layout-container">
      <Content id="content-container">
        <Layout id="layout-box">
          <div id="sider-container">
            <Sider trigger={null} className=" p-3" id="sider-section">
              <div
                className="demo-logo-vertical"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5em",
                }}
              >
                <p className="ps-3 fs-5 fw-bold mt-4">Menu</p>

                <MenuOutlined />
              </div>
              {/* <div className="demo-logo-vertical" />
            <p className="ps-3 fs-5 fw-bold mt-4">Menu</p> */}
              <Input addonBefore={<SearchOutlined />} placeholder="Search" />
              <p className="ps-3 mt-4 fs-6 fw-bold">Tasks</p>
              <Menu
                theme="light"
                mode="inline"
                style={{
                  border: "none",
                  backgroundColor: "#f4f4f4",
                }}
                defaultSelectedKeys={["/"]}
                items={[
                  {
                    key: "1",
                    icon: <DoubleRightOutlined className="text-black" />,
                    label: (
                      <Link to="/upcoming" id="upcoming" className="nav-link">
                        Upcoming
                      </Link>
                    ),
                    className: "custom-menu-item",
                  },
                  {
                    key: "2",
                    icon: <UnorderedListOutlined className="text-black" />,
                    label: (
                      <Link to="/today" id="today" className="nav-link">
                        Today
                      </Link>
                    ),
                    className: "custom-menu-item",
                  },
                  {
                    key: "3",
                    icon: <CalendarOutlined className="text-black" />,
                    label: (
                      <Link to="/calender" id="calender" className="nav-link">
                        Calender
                      </Link>
                    ),
                    className: "custom-menu-item",
                  },
                  {
                    key: "4",
                    icon: <FileAddOutlined className="text-black" />,
                    label: (
                      <Link to="/" className="nav-link" id="add_sticky">
                        Sticky Wall
                      </Link>
                    ),
                    className: "custom-menu-item",
                  },
                ]}
              />
              <Divider />
              <p className="ps-3 mt-4 fs-6 fw-bold">Lists</p>
              <div
                theme="light"
                mode="inline"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10%",
                  height: "30vh",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  border: "none",
                }}
              >
                {lists.map((list) => (
                  <div key={list.id}>
                    {editListId === list.id ? (
                      <div>
                        <Input
                          value={editedListName}
                          onChange={(e) => setEditedListName(e.target.value)}
                        />
                        <ColorPicker
                          value={editedListColor}
                          onChange={(color) => setEditedListColor(color)}
                        />
                        <Button onClick={handleSaveEdit}>Save</Button>
                      </div>
                    ) : (
                      <div style={{}}>
                        <div
                          className="mb-2"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20%",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: list.color,
                              height: "3.5vh",
                              width: "2.5vw",
                              borderRadius: "5px",
                            }}
                          ></div>
                          <Link key={list.name} to={`/list/${list.name}`}>
                            {list.name}
                          </Link>
                        </div>

                        <Button onClick={() => handleEditList(list)}>
                          Edit
                        </Button>

                        <Button onClick={() => handleDeleteList(list.id)}>
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Menu
                className="mt-3"
                theme="light"
                mode="inline"
                style={{
                  border: "none",
                  backgroundColor: "#f4f4f4",
                }}
                defaultSelectedKeys={["/"]}
                onClick={handleAddList}
                items={[
                  {
                    key: "1",
                    icon: <PlusCircleOutlined className="text-black" />,
                    label: (
                      <Link to="/upcoming" id="upcoming" className="nav-link">
                        Add List
                      </Link>
                    ),
                  },
                ]}
              />
              <Divider />
              <Menu
                theme="light"
                mode="inline"
                style={{
                  border: "none",
                  backgroundColor: "#f4f4f4",
                }}
                items={[
                  {
                    key: "1",
                    icon: <FaSignOutAlt className="text-black" />,
                    label: (
                      <Link
                        className="nav-link"
                        id="signout"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </Link>
                    ),
                  },
                ]}
              />
            </Sider>
          </div>

          <Layout
            style={{
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
          >
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
                borderTopRightRadius: "20px",
              }}
            >
              <span className="fs-3 fw-bold ms-2">Sticky Walls</span>
            </Header>
            <Content
              id="content-box"
              style={{
                minHeight: 280,
                background: colorBgContainer,
                padding: "10px",
                borderBottomRightRadius: "20px",
              }}
            >
              <div
                style={{
                  minHeight: "100%",
                  borderRadius: "20px",
                  border: "2px solid #F4F4F4",
                }}
              >
                <Routes />
              </div>
            </Content>
            <Modal
              title="Add New List"
              style={{
                top: 20,
              }}
              open={openListModal}
              onOk={handleListSubmit}
              onCancel={() => setOpenListModal(false)}
            >
              <Form layout="vertical" className="py-4">
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item label="List Name">
                      <Input
                        placeholder="Enter list name"
                        value={listName}
                        onChange={handleListNameChange}
                      />
                      {isDuplicateList && (
                        <p style={{ color: "red" }}>List Already Exists</p>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="List Color">
                      <ColorPicker
                        value={selectedListColor}
                        onChange={handleListColorChange}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </Layout>
        </Layout>
      </Content>
    </Layout>
  );
}
