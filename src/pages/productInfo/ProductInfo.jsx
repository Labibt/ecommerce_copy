import { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import { useParams } from "react-router";
import { fireDB } from "../../firebase/FirebaseConfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { summarizeReviews } from "../../utils/gemini";

const ProductInfo = () => {
  const { loading, setLoading } = useContext(myContext);
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const [product, setProduct] = useState(null);
  const [reviewSummary, setReviewSummary] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch product data
  const getProductData = async () => {
    setLoading(true);
    try {
      const productSnap = await getDoc(doc(fireDB, "products", id));
      if (productSnap.exists()) {
        setProduct({ ...productSnap.data(), id: productSnap.id });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  // Fetch reviews from Firestore
  const fetchReviews = async () => {
    try {
      const reviewRef = collection(fireDB, `products/${id}/reviews`);
      const snapshot = await getDocs(reviewRef);
      const fetchedReviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(fetchedReviews);
      return fetchedReviews.map((r) => r.text);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  // Fetch reviews & generate summary
  const loadReviewsAndSummary = async () => {
    const texts = await fetchReviews();
    if (texts.length > 0) {
      try {
        const summary = await summarizeReviews(texts);
        setReviewSummary(summary);
      } catch (err) {
        console.error("Error summarizing reviews:", err);
      }
    } else {
      setReviewSummary("No reviews yet.");
    }
  };

  // Submit new review
  const submitReview = async () => {
    if (!newReview.trim()) {
      toast.error("Review cannot be empty");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(fireDB, `products/${id}/reviews`), {
        text: newReview.trim(),
        user: "Anonymous", // Replace with actual user info if available
        date: serverTimestamp(),
      });
      toast.success("Review submitted!");
      setNewReview("");
      await loadReviewsAndSummary(); // refresh reviews and summary after submit
    } catch (error) {
      toast.error("Failed to submit review");
      console.error("Error submitting review:", error);
    }
    setSubmitting(false);
  };

  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("Added to cart");
  };

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Removed from cart");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    getProductData();
    loadReviewsAndSummary();
  }, [id]);

  return (
    <Layout>
      <section className="py-5 lg:py-16 font-poppins dark:bg-gray-800">
        {loading || !product ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="max-w-6xl px-4 mx-auto">
            <div className="flex flex-wrap mb-24 -mx-4">
              {/* Image */}
              <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
                <img
                  className="w-full lg:h-[39em] rounded-lg"
                  src={product.productImageUrl}
                  alt={product.title}
                />
              </div>

              {/* Product Info */}
              <div className="w-full px-4 md:w-1/2">
                <div className="lg:pl-20">
                  <h2 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    {product.title}
                  </h2>
                  <p className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-400">
                    ₹ {product.price}
                  </p>

                  <div className="mb-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-400">
                      Description:
                    </h3>
                    <p>{product.description}</p>
                  </div>

                  {/* Review Summary */}
                  <div className="mb-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-400">
                      What People Are Saying (Summary):
                    </h3>
                    <p className="italic text-gray-600 dark:text-gray-300">
                      {reviewSummary}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex flex-wrap items-center mb-6">
                    {cartItems.some((p) => p.id === product.id) ? (
                      <button
                        onClick={() => deleteCart(product)}
                        className="w-full px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl"
                      >
                        Remove from Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => addCart(product)}
                        className="w-full px-4 py-3 text-pink-600 bg-pink-100 border border-pink-600 hover:bg-pink-600 hover:text-white rounded-xl"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>

                  {/* Buy Now */}
                  <div className="flex gap-4 mb-6">
                    <button className="w-full px-4 py-3 text-white bg-pink-600 hover:bg-pink-700 rounded-xl">
                      Buy Now
                    </button>
                  </div>

                  {/* Review Submission */}
                  <div className="mb-8">
                    <h3 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-400">
                      Leave a Review:
                    </h3>
                    <textarea
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200"
                      placeholder="Write your review here..."
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      disabled={submitting}
                    />
                    <button
                      onClick={submitReview}
                      disabled={submitting}
                      className="mt-3 px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>

                  {/* Optional: Show all reviews */}
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-400">
                      All Reviews:
                    </h3>
                    {reviews.length === 0 ? (
                      <p className="italic text-gray-600 dark:text-gray-300">
                        No reviews yet.
                      </p>
                    ) : (
                      <ul className="space-y-4 max-h-60 overflow-y-auto">
                        {reviews
                          .sort((a, b) => b.date?.seconds - a.date?.seconds) // newest first
                          .map((rev) => (
                            <li
                              key={rev.id}
                              className="p-3 border rounded-md dark:border-gray-600"
                            >
                              <p>{rev.text}</p>
                              <small className="text-gray-500">
                                {rev.user || "Anonymous"} —{" "}
                                {rev.date
                                  ? new Date(rev.date.seconds * 1000).toLocaleString()
                                  : "Just now"}
                              </small>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default ProductInfo;
