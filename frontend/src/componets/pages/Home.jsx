import React, { use, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  deleteTask,
  getTasks,
  setModel,
  updateTask,
} from "../../redux/slice/taskSlice";
import { IconEye, IconEdit, IconTrash, IconPlus, IconLoader, IconCircleDashedCheck, IconHistoryToggle } from "@tabler/icons-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import useDebounce from "../../hook/useDebounce ";

const Home = () => {
  const dispatch = useDispatch();
  const { tasks, loading, model } = useSelector((state) => state.tasks);
  const [status, setStatus] = useState();
  const [search, setSearch] = useState();
  const searchDebounce = useDebounce(search, 500);

  useEffect(() => {
    dispatch(getTasks({ status, search }));
  }, [dispatch, status, searchDebounce]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
      status: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      dueDate: Yup.date().required("Due Date is required"),
    }),
    onSubmit: (values) => {
      if (model.data) {
        dispatch(updateTask(values));
      } else {
        dispatch(addTask(values));
      }
    },
  });

  const inputBaseClasses =
    "bg-gray-50 border-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";
  const getInputClasses = (field) =>
    `${inputBaseClasses} ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-500"
        : "border-gray-300"
    }`;

  const handleUpdate = (data) => {
    formik.setValues({
      ...data,
      dueDate: data.dueDate.split("T")[0],
    });
    dispatch(setModel({ isOpen: true, data }));
  };

  const handleView = (data) => {
    formik.setValues({
      ...data,
      dueDate: data.dueDate.split("T")[0],
    });
    dispatch(setModel({ isOpen: true, data, type: "view" }));
  };

  return (
    <div className="">
      <div className=" w-4/5 mx-auto mt-5">
        <div className="border rounded-xl bg-gray-50">
          <div className="border-b py-3 px-6 items-center flex justify-between w-100">
            <p className="font-semibold text-2xl">Task List</p>
            <div className="flex gap-2">
              <input
                type="text"
                id="title"
                name="title"
                className="bg-gray-50 border-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search here"
                value={search}
              />
              <select
                id="status"
                name="status"
                onChange={(e) => {
                  setStatus(
                    e.target.value === "all" ? undefined : e.target.value
                  );
                }}
                className={
                  "bg-gray-50 border-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                }
              >
                <option value={"all"}>All</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <button
                className="bg-blue-200 rounded-lg p-2"
                onClick={() => {
                  dispatch(
                    setModel({
                      isOpen: true,
                    })
                  );
                }}
              >
                <IconPlus />
              </button>
            </div>
          </div>
          {loading ? (
            <div
              role="status"
              className=" px-5 my-2 gap-3 flex flex-col animate-pulse w-full"
            >
              <div className="h-16 bg-gray-200 rounded-xl  dark:bg-gray-700 w-full" />
              <div className="h-16 bg-gray-200 rounded-xl  dark:bg-gray-700 w-full" />
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <>
              {!tasks.length ? (
                <>
                  <div className="py-5 px-6 text-center font-semibold">
                    No tasks found
                  </div>
                </>
              ) : (
                tasks.map((item) => {
                  return (
                    <div className="border-b py-5 px-6" key={item._id}>
                      <div className="flex justify-between items-center ">
                        <div className="flex  items-center gap-3">
                          <p className="font-medium">{item?.title}</p>
                          {
                            item?.status === "PENDING" ?  <Badge icon={IconHistoryToggle} color="info">PENDING</Badge> : ""
                          }
                          {
                            item?.status === "IN_PROGRESS" ?  <Badge icon={IconLoader}  color="yellow">PROGRESS</Badge> : ""
                          }
                          {
                            item?.status === "COMPLETED" ?  <Badge icon={IconCircleDashedCheck} color="success">COMPLETED</Badge> : ""
                          }
                          
                        </div>
                        <div className="flex justify-between gap-3">
                          <button
                            className="bg-green-200 p-2 rounded-lg"
                            onClick={() => {
                              handleView(item);
                            }}
                          >
                            <IconEye />
                          </button>
                          <button
                            className="rounded-lg p-2 bg-yellow-200"
                            onClick={() => {
                              handleUpdate(item);
                            }}
                          >
                            <IconEdit />
                          </button>
                          <button
                            className="bg-red-200 p-2 rounded-lg"
                            onClick={() => {
                              dispatch(deleteTask(item?._id));
                            }}
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
      <Modal
        show={model.isOpen}
        onClose={() => {
          dispatch(setModel({ isOpen: false, data: null }));
        }}
      >
        <ModalHeader>
          {model.data
            ? model.type === "view"
              ? "View Task"
              : "Update Task"
            : "Add Task"}
        </ModalHeader>
        <ModalBody className="py-3">
          <form
            className=" mx-auto flex flex-col gap-3"
            onSubmit={formik.handleSubmit}
          >
            {/* Title */}
            <div className="">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={getInputClasses("title")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                disabled={model?.type === "view"}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {formik.errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className={getInputClasses("description")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                disabled={model?.type === "view"}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {formik.errors.description}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div className="">
              <label
                htmlFor="dueDate"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className={getInputClasses("dueDate")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dueDate}
                disabled={model?.type === "view"}
              />
              {formik.touched.dueDate && formik.errors.dueDate && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {formik.errors.dueDate}
                </p>
              )}
            </div>

            {/* Status */}
            {model.data ? (
              <>
                <div className="">
                  <label
                    htmlFor="status"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className={getInputClasses("status")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.status}
                    disabled={model?.type === "view"}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <p className="mt-1 text-xs font-semibold text-red-600">
                      {formik.errors.status}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          {model.type !== "view" ? (
            <>
              <Button
                onClick={() => {
                  formik.handleSubmit();
                }}
              >
                Done
              </Button>
            </>
          ) : (
            ""
          )}

          <Button
            color={model.type !== "view" ? "failure" : "success"}
            onClick={() => dispatch(setModel({ isOpen: false, data: null }))}
          >
            {model.type === "view" ? "Close" : "Decline"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Home;
