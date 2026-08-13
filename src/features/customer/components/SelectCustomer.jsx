"use client";

import NextInput from "@/components/form/nextinput/NextInput";
import ComboboxAdapter from "@/components/ui/combobox-adapter";
import { useCUSTOMERStore } from "@/store/customerStore";
import { ChevronsDown, RefreshCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  provinceList,
  getJsonofCityAndDistrict,
} from "get-srilanka-districts-cities";

const provincesList = provinceList()[0].map((province) => ({
  value: province,
  label: province,
}));

const SelectCustomer = ({ customersList, island = true }) => {
  const [cityList, setcityList] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const setCustomerField = useCUSTOMERStore((state) => state.setCustomerField);
  const customerState = useCUSTOMERStore((state) => state.customerState);
  const customerId = useCUSTOMERStore((state) => state.customerId);
  const firstName = useCUSTOMERStore((state) => state.firstName);
  const lastName = useCUSTOMERStore((state) => state.lastName);
  const phone = useCUSTOMERStore((state) => state.phone);
  const email = useCUSTOMERStore((state) => state.email);
  const province = useCUSTOMERStore((state) => state.province);
  const city = useCUSTOMERStore((state) => state.city);
  const address = useCUSTOMERStore((state) => state.address);
  const resetCustomer = useCUSTOMERStore((state) => state.resetCustomer);

  useEffect(() => {
    setisOpen(false);
    resetCustomer();
  }, []);

  const getCitiesByProvince = (province) => {
    if (!province) return [];

    const data = getJsonofCityAndDistrict(province);

    return [...new Set(Object.values(JSON.parse(data[0])).flat())]
      .sort((a, b) => a.localeCompare(b))
      .map((city) => ({
        value: city,
        label: city,
      }));
  };

  return (
    <div className="relative">
      <div
        className={`${island && `bg-white rounded-xl shadow-md  p-4`} flex flex-col space-y-4`}
      >
        <div className="flex gap-2 justify-between items-center">
          <div className="flex items-center bg-gray-200 hover:bg-gray-300 rounded-xl">
            <button
              className={`px-4 py-1.5 rounded-xl transition-colors duration-300 ${customerState == 0 ? `bg-blue-500  text-white` : `text-gray-600`}`}
              onClick={() => {
                setisOpen(false);
                resetCustomer();
                setCustomerField(`customerState`, 0);
              }}
            >
              Exsisting
            </button>
            <button
              className={`px-4 py-1.5 rounded-xl  transition-colors duration-300 ${customerState == 1 ? `bg-blue-500  text-white` : `text-gray-600`}`}
              onClick={() => {
                setisOpen(false);
                resetCustomer();
                setCustomerField(`customerState`, 1);
              }}
            >
              New
            </button>
          </div>
          <div className="flex items-center gap-2">
            {customerState == 1 && (
              <button
                onClick={() => setisOpen(!isOpen)}
                className="px-2 text-white py-2 rounded-xl group bg-amber-500 hover:bg-amber-600 transition-colors duration-300"
              >
                <ChevronsDown size={20} className="" />
              </button>
            )}
            <button
              onClick={() => {
                setisOpen(false);
                resetCustomer();
              }}
              className="px-2 text-white py-2 rounded-xl group bg-red-400 hover:bg-red-600 transition-colors duration-300"
            >
              <RefreshCcw
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
        {/* exsisting customer */}
        {customerState == 0 ? (
          <div className="">
            <ComboboxAdapter
              name={`customer`}
              items={customersList}
              defaultValue={customerId}
              placeholder="Select Customer ..."
              onChange={(value, customer) => {
                setCustomerField("customerId", value);
                setCustomerField("firstName", customer?.first_name);
                setCustomerField("lastName", customer?.last_name);
                setCustomerField("phone", customer?.phone || ``);
              }}
            />
          </div>
        ) : (
          <div className=" grid grid-cols-3 gap-x-2">
            <NextInput
              name={`firstName`}
              placeholder={`First Name`}
              value={firstName}
              className={`w-full`}
              max={50}
              onChange={(e) => setCustomerField(`firstName`, e.target.value)}
            />
            <NextInput
              name={`lastName`}
              placeholder={`Last Name`}
              value={lastName}
              className={`w-full`}
              max={50}
              onChange={(e) => setCustomerField(`lastName`, e.target.value)}
            />
            <NextInput
              name={`phone`}
              placeholder={`Phone`}
              value={phone}
              className={`w-full`}
              max={10}
              onChange={(e) => setCustomerField(`phone`, e.target.value)}
            />
          </div>
        )}
      </div>

      <div
        className={`absolute mt-4 w-full bg-white border border-gray-300 hover:border-blue-500 rounded-xl shadow-md p-4 space-y-4
          origin-top transition-all duration-300 ease-in-out overflow-hidden
         ${
           isOpen
             ? "opacity-100 scale-100 translate-y-0 pointer-events-auto p-4"
             : "opacity-0 scale-95 -translate-y-2 pointer-events-none p-0"
         }
        `}
      >
        <button
          onClick={() => setisOpen(false)}
          className="px-2 text-white py-2 rounded-xl group bg-red-400 hover:bg-red-600 transition-colors duration-300 "
        >
          <X
            size={20}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
        </button>

        <div className=" grid grid-cols-2 gap-2">
          <NextInput
            name={`firstName`}
            required={true}
            label={`First-Name`}
            placeholder={`Ravindu`}
            value={firstName}
            className={`w-full`}
            max={50}
            onChange={(e) => setCustomerField(`firstName`, e.target.value)}
          />
          <NextInput
            name={`lastName`}
            required={true}
            label={`Last-Name`}
            placeholder={`Ajan`}
            value={lastName}
            className={`w-full`}
            max={50}
            onChange={(e) => setCustomerField(`lastName`, e.target.value)}
          />
          <NextInput
            name={`phone`}
            required={true}
            label={`Phone`}
            placeholder={`0788806670`}
            value={phone}
            className={`w-full `}
            max={10}
            onChange={(e) => setCustomerField(`phone`, e.target.value)}
          />
          <NextInput
            name={`email`}
            label={`Email`}
            placeholder={`ajan@gmail.com`}
            value={email}
            type="email"
            className={`w-full`}
            max={50}
            onChange={(e) => setCustomerField(`email`, e.target.value)}
          />
          <ComboboxAdapter
            name={`province`}
            label={`Province`}
            items={provincesList}
            defaultValue={province}
            placeholder="Select Customer ..."
            onChange={(value, province) => {
              setCustomerField("province", value);
              setCustomerField("city", "");

              setcityList(getCitiesByProvince(value));
            }}
          />
          <ComboboxAdapter
            name={`city`}
            label={`City`}
            disabled={!province}
            items={cityList}
            defaultValue={city}
            placeholder="Select City ..."
            onChange={(value, city) => {
              setCustomerField("city", value);
            }}
          />
          <NextInput
            name={`address`}
            label={`Address`}
            placeholder={`361/23 Parangoda, Dekatana`}
            value={address}
            className={`w-full col-span-2`}
            max={50}
            onChange={(e) => setCustomerField(`address`, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectCustomer;
