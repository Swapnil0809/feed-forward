import { useMutation } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

import FormWrapper from "../formComponents/FormWrapper";
import Input from "../formComponents/Input";
import { createFormData } from "../../utils/createFormData";
import { parseErrorMessage } from "../../utils/parseErrorMessage";
import { useFetchCoordinates } from "../../hooks/useFetchCoordinates";
import { cityAdminSchema } from "../../utils/validations";
import { addCityAdmin } from "../../api/admin";

function AddCityAdmin({ setAddCityAdmin }) {
  const { mutateAsync: fetchCoordinates } = useFetchCoordinates();

  const addCityAdminMutation = useMutation({
    mutationFn: addCityAdmin,
    onSuccess: () => {
      toast.success("City admin added successfully");
      setAddCityAdmin(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error(parseErrorMessage(error?.response));
    },
  });

  const handleSubmit = async (data) => {
    const coordinates = await fetchCoordinates(data.pincode);
    data.coordinates = coordinates;
    const formData = createFormData(data);
    addCityAdminMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out my-8">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Add City Admin
          </h2>
          <button
            className="text-white hover:text-gray-200 transition duration-150 ease-in-out"
            onClick={() => setAddCityAdmin(false)}
          >
            <IoClose className="text-2xl sm:text-3xl" />
          </button>
        </div>
        <div className="p-4 sm:p-6 md:p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <FormWrapper onSubmit={handleSubmit} schema={cityAdminSchema}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { name: "username", label: "Username", type: "text" },
                { name: "email", label: "Email", type: "email" },
                { name: "phoneNo", label: "Phone Number", type: "tel" },
                { name: "password", label: "Password", type: "password" },
                { name: "address", label: "Address", type: "text" },
                { name: "city", label: "City", type: "text" },
                { name: "state", label: "State", type: "text" },
                { name: "pincode", label: "Pincode", type: "text" },
              ].map((field) => (
                <div key={field.name} className="relative">
                  <Input
                    name={field.name}
                    label={field.label}
                    type={field.type}
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={addCityAdminMutation.isPending}
              className=" w-full bg-green-500 text-white px-6 py-3 rounded-xl text-base sm:text-lg font-medium transition duration-300 ease-in-out hover:bg-green-600"
            >
              {addCityAdminMutation.isPending ? (
                <BeatLoader color="#fff" size={8} />
              ) : (
                "Add City Admin"
              )}
            </button>
          </FormWrapper>
        </div>
      </div>
    </div>
  );
}

export default AddCityAdmin;
