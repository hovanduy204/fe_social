import { useState } from "react";
import { useAppDispatch } from "@/redux/configs/hooks";
import { login } from "@/redux/features/auth";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from "next/link";
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import AlertSnackbar from "../common/AlertSnackbar";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      setError("");
      setAlert({
        open: true,
        message: "Đăng nhập thành công! Đang chuyển hướng...",
        severity: "success",
      });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setError("Email hoặc mật khẩu không đúng");
      } else if (error?.response?.status === 404) {
        setError("Không tìm thấy email");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/register");
    }, 500); // Match the animation duration
  };

  return (
    <div
  className={`min-h-screen grid grid-cols-1 md:grid-cols-[2fr_1fr] transition-opacity duration-500 p-14 bg-gradient-to-br from-blue-400 via-purple-200 to-orange-300  ${
    isTransitioning ? "opacity-50" : "opacity-100"
  }`}
>
  {/* Left panel: Logo & background */}
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
      Chào mừng bạn đã trở lại!
    </p>
  </div>

  {/* Right panel: Login Form */}
  <div className="flex items-center justify-center bg-white p-3 border border-blue-100 opacity-90">
    <div className="w-full max-w-md space-y-6 bg-opacity-50 p-6 md:p-8 rounded-2xl  backdrop-blur-lg">
      {/* Logo shown only on mobile */}
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
      <div className="text-center mb-15">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-orange-500 bg-clip-text text-transparent">
          Đăng nhập
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative flex items-center">
          <HiOutlineMail className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
              error ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50`}
            required
          />
        </div>
        <div className="relative flex items-center">
          <HiOutlineLockClosed className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
              error ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50`}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
        <button
          type="submit"
          disabled={!formData.email || !formData.password}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Đăng nhập
        </button>
      </form>
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-blue-500 font-semibold hover:text-blue-600 transition-colors"
        >
          Quên mật khẩu?
        </Link>
      </div>
      <div className="text-center">
        <p className="text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            onClick={handleRegisterClick}
            className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  </div>
</div>

  );
};

export default LoginForm;