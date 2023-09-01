import React, { useEffect, useState } from "react";
import { auth, firestore } from "config/firebase";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "contexts/AuthContext";
import Sider from "antd/es/layout/Sider";
import {
  SearchOutlined,
  MenuOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  FileOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";
import { FaSignOutAlt } from "react-icons/fa";
import {
  Button,
  Col,
  ColorPicker,
  Form,
  Input,
  Menu,
  Modal,
  Row,
  message,
} from "antd";
import { MenuProps } from "antd";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const items: MenuProps["items"] = [
  {
    key: "1",
    icon: <DoubleRightOutlined />,
    label: "Upcomings", // Change the label to "Profile"
    path: "/upcoming",
  },
  {
    key: "2",
    icon: <UnorderedListOutlined />,
    label: "Today", // Change the label to "Videos"
    path: "/today",
  },
  {
    key: "3",
    icon: <CalendarOutlined />,
    label: "Calender", // Change the label to "Videos"
    path: "/calendar",
  },
  {
    key: "4",
    icon: <FileOutlined />,
    label: "Todos", // Change the label to "Videos"
    path: "/todos",
  },
];
export default function Sidebar({ listsProp }) {
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
    <div>
      <Sider
        style={{
          overflow: "auto",
          height: "100%",
          backgroundColor: "#F4F4F4",
          padding: "1em",
          borderRadius: "10px",
        }}
      >
        <div
          className="demo-logo-vertical"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5em",
          }}
        >
          <p>Menu</p>
          <MenuOutlined />
        </div>
        <Input placeholder="Search" prefix={<SearchOutlined />} />
        <p>Tasks</p>
        <Menu
          mode="inline"
          defaultSelectedKeys={["4"]}
          selectedKeys={[selectedMenuItem]}
          onSelect={(item) => setSelectedMenuItem(item.key.toString())}
          style={{ backgroundColor: "#F4F4F4" }}
        >
          {/* {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              className={
                selectedMenuItem === item.key ? "selected-menu-item" : ""
              }
            >
              {item.label}
            </Menu.Item>
          ))} */}
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              className={
                selectedMenuItem === item.key ? "selected-menu-item" : ""
              }
            >
              <NavLink
                to={item.path} // Use NavLink instead of Menu.Item
                activeClassName="selected-menu-item" // Add this class when the link is active
              >
                {item.label}
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>

        <p>Lists</p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10%",
            height: "30vh",
            overflowY: "scroll",
            overflowX: "hidden",
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
                  {/* Display the list name and color */}
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
                    {/* <p className="mb-0">{list.name}</p> */}
                  </div>

                  {/* Edit button */}
                  <Button onClick={() => handleEditList(list)}>Edit</Button>
                  <Button onClick={() => handleDeleteList(list.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <span
          id="pluseCard"
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            cursor: "pointer",
          }}
          onClick={handleAddList}
        >
          + Add New List
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "2.4vw",
            gap: "8px",
            marginTop: "20px",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <p className="mb-0">Sign Out</p>
        </div>
      </Sider>
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
    </div>
  );
}
