"use client";

import { useState } from "react";
import { useAppDispatch } from "@/redux/configs/hooks";
import { register } from "@/redux/features/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Email, Person, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import AlertSnackbar from "../common/AlertSnackbar";
import { validateEmail } from "@/services/emailValidation";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") setEmailError("");
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailFormat(formData.email)) {
      setEmailError("Email không hợp lệ");
      return;
    }

    try {
      setIsValidating(true);
      const isValid = await validateEmail(formData.email);
      if (!isValid) {
        setEmailError("Email không tồn tại hoặc không hợp lệ");
        setIsValidating(false);
        return;
      }

      await dispatch(register(formData)).unwrap();
      setAlert({
        open: true,
        message: "Đăng ký thành công! Đang chuyển hướng...",
        severity: "success",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      setAlert({
        open: true,
        message: "Đăng ký thất bại. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div
      className={`min-h-screen grid grid-cols-1 md:grid-cols-[2fr_1fr] transition-opacity duration-500 p-8 bg-gradient-to-br from-blue-400 via-purple-200 to-orange-300 ${
        isTransitioning ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* Left panel: Logo & welcome message */}
      <div className="hidden md:flex flex-col items-center justify-center bg-white/50 space-y-6 border border-blue-100 backdrop-blur-mg">
        <Image
          src="/image/logoCasa.png"
          alt="CasaSocial"
          width={160}
          height={160}
          className="rounded-full border-4 border-white shadow-md"
          priority
        />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-orange-500 bg-clip-text text-transparent">
          CasaSocial
        </h1>
        <p className="font-bold bg-blue-400 bg-clip-text text-transparent">
          Tham gia cộng đồng cùng chúng tôi!
        </p>
      </div>

      {/* Right panel: Register form */}
      <div className="flex items-center justify-center bg-white border border-blue-100 opacity-90">
        <div className="w-full max-w-md space-y-6 bg-opacity-50 p-4 md:p-4 rounded-2xl backdrop-blur-lg">
          {/* Logo on mobile */}
          <div className="flex md:hidden justify-center mb-6">
            <Image
              src="/image/logoCasa.png"
              alt="CasaSocial"
              width={120}
              height={120}
              className="rounded-full border-4 border-white shadow-md"
              priority
            />
          </div>
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-orange-500 bg-clip-text text-transparent">
              Đăng ký
            </h1>
            <p className="mt-1 text-gray-600">Tạo tài khoản mới để bắt đầu</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Email className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                emailError ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50`}
              required
            />
            {emailError && (
              <p className="text-sm text-red-500 text-center mt-1">{emailError}</p>
            )}
          </div>

          {/* Username */}
          <div className="relative">
            <Person className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Tên người dùng"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.email || !formData.username || !formData.password || isValidating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isValidating ? "Đang kiểm tra email..." : "Đăng ký"}
          </button>
        </form>
          <div className="text-center text-sm text-gray-600">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <span className="text-blue-500 font-medium cursor-pointer hover:underline">
              Điều khoản
            </span>{" "}
            và{" "}
            <span className="text-blue-500 font-medium cursor-pointer hover:underline">
              Chính sách bảo mật
            </span>
            .
          </div>
          <div className="text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                onClick={handleLoginClick}
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AlertSnackbar
        open={alert.open}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
    </div>
  );
};

export default RegisterForm;
