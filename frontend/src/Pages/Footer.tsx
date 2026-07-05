import qr from "./../assets/qr_code.svg";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";

import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <div className="bg-black/85 text-white py-4 flex flex-col gap-1 lg:pt-0 pt-10 w-full">
            <div className=" w-full mx-auto text-center flex lg:flex-row md:flex-row flex-col justify-evenly items-center lg:gap-20 gap-8 pb-0 lg:pb-4">
                <div>
                    <div className=" flex flex-col ">
                        <h1 className="text-3xl font-bold">District</h1>
                        <span className=" font-bold text-[10px] ">BY ZOMATO</span>
                        </div>
                </div>
                <div className="flex lg:flex-row md:flex-row flex-col gap-2 lg:gap-8 items-center px-8">
                    <span className=" font-semibold">Terms & Conditions</span>
                    <span className=" font-semibold">Privacy Policy</span>
                    <span className=" font-semibold">Contact Us</span>
                    <span className=" font-semibold">List your events</span>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center py-4 pt-10">
                    <img src={qr} alt="Zomato Logo" className="h-25 rounded-xl w-auto" />
                    <span className="text-lg ">Scan to Download the app</span>
                </div>
            </div>
            <div className="flex flex-row justify-evenly items-center px-6"    >
                <span className="w-full h-[1px] bg-gray-600 "></span>
            </div>
            <div className="flex lg:flex-row md:flex-row flex-col justify-evenly items-center px-6 gap-4">
                <div>
                    <p className="text-start text-sm px-10 text-gray-400">
                    By accessing this page, you confirm that you have read, understood, and agreed to our Terms of Service, Cookie Policy, Privacy Policy, and Content Guidelines. All rights reserved.
                </p>
                </div>
                <div className="flex flex-row gap-4 py-4 pb-8 items-center justify-center text-4xl  text-white">
                     <span><FaWhatsapp /></span>
                    <span><FaFacebook /></span>
                    <span><FaInstagram /></span>
                    <span><FaXTwitter /></span>
                    <span><FaYoutube /></span>
                </div>

            </div>
        </div>
    );
}