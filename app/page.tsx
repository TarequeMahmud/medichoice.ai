import { PatientForm } from "@/components/forms/PatientForm";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verification | PasskeyModal */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[500px] ">
          <div className="flex w-full p-2 items-center mb-2 border-2 rounded-md border-zinc-200">
            <Image
              src="./assets/icons/logo-full.svg"
              alt="Logo"
              width={100}
              height={100}
            />
            <p className="font-bold text-6xl">CLINICLINK</p>
          </div>
          <div className="">
            <PatientForm />
          </div>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 ClinicLink
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/healthcare.jpg"
        height={1000}
        width={1000}
        alt="healthcare"
        className="side-img max-w-[50%] h-100"
      />
    </div>
  );
}
