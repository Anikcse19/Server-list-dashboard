import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import baseUrl from "../../../config";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUserPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [serverIds, setServerIds] = useState([]);
  const [clientsList, setClientsList] = useState([]);

  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const token = Cookies.get("token");

  const fetchClientsList = async () => {
    try {
      axios
        .get(`${baseUrl}/wa-client/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            setClientsList(res?.data?.data?.data);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchClientsList();
  }, []);

  useEffect(() => {
    axios
      .get(`${baseUrl}/get-user-data/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (res?.data?.status) {
          setFullName(res?.data?.data?.name);
          setEmail(res?.data?.data?.email);
          setRole(res?.data?.data?.user_type);
          setServerIds(res?.data?.data?.serverIds);
        }
      });
  }, []);

  const handleUpdateUser = async () => {
    try {
      const createUserData = {
        email,
        full_name: fullName,
        role_type: parseInt(role),
        serverIds: serverIds,
      };

      axios
        .post(`${baseUrl}/get-user-data/${id}`, createUserData, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            navigate("/dashboard/user-lists");
          } else {
            toast.error(res?.data?.message);
          }
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setFullName("");
      setEmail("");
      // setPassword("");
      setRole("");
    }
  };

  return (
    <Layout>
      <div className="w-full h-screen flex justify-center mt-20 ">
        <div
          style={{
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
          className=" flex flex-col gap-y-5 border-2 border-black h-fit p-10 rounded-md bg-white w-[500px]"
        >
          <div className="flex justify-center">
            <h1 className="font-bold">Update User</h1>
          </div>
          <div className="flex flex-col gap-y-2 mt-5">
            <label htmlFor="fullname">Fullname</label>
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              className="w-[90%] py-3 px-3 rounded-md outline-none border-2 border-black"
            />
          </div>

          <div className="flex flex-col gap-y-2 ">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-[90%] py-3 px-3 rounded-md outline-none border-2 border-black"
            />
          </div>

          {/* <div className="flex flex-col gap-y-2">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="w-[90%] py-3 px-3 rounded-md outline-none border-2 border-black"
            />
          </div> */}

          <div className="flex flex-col gap-y-2">
            <label htmlFor="server_ids">Server Ids</label>
            <div className="flex items-center flex-wrap gap-2">
              {serverIds &&
                serverIds.length > 0 &&
                serverIds.map((id) => (
                  <p
                    className="bg-teal-200 text-teal-700 px-3 py-1 rounded"
                    key={id}
                  >
                    {id}
                  </p>
                ))}
            </div>
            <select
              onChange={(e) => {
                if (!serverIds || serverIds.length <= 0) {
                  setServerIds([e.target.value]);
                } else {
                  if (
                    serverIds &&
                    serverIds.length > 0 &&
                    !serverIds.includes(parseInt(e.target.value))
                  ) {
                    setServerIds((prev) => [...prev, parseInt(e.target.value)]);
                  } else {
                    toast.error("Already Exists");
                  }
                }
              }}
              name=""
              id="server_ids"
              className="w-[90%] py-3 px-3 rounded-md outline-none border-2 border-black"
            >
              <option value="">Select Server id---</option>
              {clientsList.map((client) => (
                <option key={client?.id} value={client?.id}>
                  {client?.server}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="role">Role</label>
            <select
              onChange={(e) => setRole(e.target.value)}
              value={role}
              name=""
              id="role"
              className="w-[90%] py-3 px-3 rounded-md outline-none border-2 border-black"
            >
              <option value="">Select Role---</option>
              <option value="1">Administrator</option>
              <option value="2">Editor</option>
            </select>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleUpdateUser}
              className="bg-blue-200 text-blue-700 px-5 py-2 rounded-md"
            >
              Update User
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateUserPage;
