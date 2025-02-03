import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useParams,  // To access the dynamic URL parameter
} from "react-router-dom";
// Import your components
import Navbar from "./components/Navbar";
import Footer from "./Footer";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import SignIn from "./Authen/SignIn";
import SignUp from "./Authen/SignUp";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminPanel from "./Admin/AdminPanel";
import PostEditor from "./Admin/PostEditor";
import Blog from "./components/Blog";
import Food from "./components/Recipe"; 
import Drinks from "./components/Drinks";
import Dessert from "./components/Dessert"; 
import ProductsReview from "./components/ProductsReview";
import StyleAdvisor from "./components/StyleAdvisor"; 
import PostDetailPage from "./components/PostDetailPage";  // New component for post details
import { auth } from "./Admin/firebaseConfig";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Footer Wrapper to handle conditional rendering
const FooterWrapper = () => {
  const location = useLocation();

  const noFooterRoutes = ["/login", "/signup"];

  if (noFooterRoutes.includes(location.pathname)) {
    return null;
  }
  return <Footer />;
};

const App = () => {
  return (
    <Router>
      <div
        id="app-layout"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />

        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/food" element={<Food />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/dessert" element={<Dessert />} />
            <Route path="/products-review" element={<ProductsReview />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/style-advisor" element={<StyleAdvisor />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin Routes */}
            <Route
              path="/admindashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminpanel"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posteditor"
              element={
                <ProtectedRoute>
                  <PostEditor />
                </ProtectedRoute>
              }
            />

            {/* Dynamic Route for Post Detail */}
            <Route path="/posts/:id" element={<PostDetailPage />} />
          </Routes>
        </div>

        <FooterWrapper />
      </div>
    </Router>
  );
};

export default App;
