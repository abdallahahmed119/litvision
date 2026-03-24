import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // تأكد من تثبيت framer-motion
import Layout from "@/components/Layout";
import { getBookById } from "@/lib/books";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Star,
  Bookmark,
  Share2,
  Download,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { toast } from "sonner";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = getBookById(id || "");

  // حالة التحكم في فتح واجهة القراءة (الكتاب المقسوم)
  const [isReading, setIsReading] = useState(false);

  if (!book) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              Book Not Found
            </h2>
            <Button onClick={() => navigate("/home")}>Go Back Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleBookmark = () => {
    toast.success("Book added to your library!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Layout>
      <div className="p-6 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Book Cover */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col gap-4 hidden lg:flex">
                <button className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors">
                  <ChevronUp className="w-5 h-5 text-foreground" />
                </button>
                <button className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors">
                  <ChevronDown className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="w-72 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right - Book Info */}
          <div className="animate-slide-up">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {book.title}
            </h1>
            <p className="text-xl font-medium text-foreground mb-4">
              {book.author}
            </p>
            <p className="text-muted-foreground italic mb-8 text-lg">
              {book.description.slice(0, 100)}...
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-10">
              <Button 
                size="xl" 
                variant="accent" 
                className="gap-2"
                onClick={() => setIsReading(true)} // تشغيل واجهة القراءة
              >
                Start reading
                <span className="text-lg">↗</span>
              </Button>

              <Button
                size="xl"
                variant="outline"
                onClick={() => navigate(`/summary/${book.id}`)}
                className="gap-2"
              >
                Summary
                <Star className="w-4 h-4" />
              </Button>

              <button
                onClick={handleBookmark}
                className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Bookmark className="w-5 h-5" />
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button className="p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* Description Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">Language</h4>
                  <p className="text-muted-foreground">{book.language}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Pages</h4>
                  <p className="text-muted-foreground">{book.pages} pages</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">ISBN</h4>
                  <p className="text-muted-foreground">{book.isbn}</p>
                </div>
              </div>
            </div>

            {/* Reader Reviews Section - تم إكماله هنا */}
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                Reader Reviews
              </h3>
              <div className="space-y-4">
                {book.reviews && book.reviews.length > 0 ? (
                  book.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={review.avatar}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-muted"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground">
                            {review.userName}
                          </span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm italic leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- واجهة الكتاب المقسوم (Video + Content) --- */}
        <AnimatePresence>
          {isReading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg flex items-center justify-center p-2 md:p-10"
            >
              <button 
                onClick={() => setIsReading(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full z-[110]"
              >
                <X size={32} />
              </button>

              <motion.div 

               initial={{ rotateY: -25, scale: 0.85, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ rotateY: 25, scale: 0.9, opacity: 0 }}
               transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
                className="w-full max-w-7xl h-[90vh] flex flex-col md:flex-row bg-[#fdfaf3] shadow-[0_0_60px_rgba(0,0,0,0.7)] rounded-xl overflow-hidden"
                style={{ perspective: "2000px" }}
              >
                {/* النصف الأيسر: الفيديو */}
                <div className="w-full md:w-1/2 h-full bg-black flex items-center justify-center relative shadow-2xl">
                  <div className="absolute top-4 left-6 text-white/50 font-serif italic text-sm tracking-widest z-10">VISUAL CHAPTER</div>
                  <video 
                    controls 
                    autoPlay
                    className="w-full h-full object-contain"
                    src={(book as any).videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} // فيديو افتراضي لو مش موجود
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* النصف الأيمن: كلام الكتاب */}
                <div className="w-full md:w-1/2 h-full p-8 md:p-14 overflow-y-auto relative scrollbar-hide">
                  <div className="max-w-prose mx-auto">
                    <span className="text-accent/60 font-serif italic text-sm">Now Reading...</span>
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-stone-900 mt-2 mb-8 border-b border-stone-200 pb-6 leading-tight">
                      {book.title}
                    </h2>
                    
                    <div className="text-stone-800 leading-loose font-serif text-lg space-y-6">
                      <p className="first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-accent">
                        {book.description}
                      </p>
                      <p>
                        {/* هنا يمكنك وضع محتوى الكتاب الحقيقي إذا كان متاحاً في بيانات الـ book */}
                        هذا النص يمثل محتوى الكتاب الداخلي الذي يتفاعل مع المشاهد المعروضة في الفيديو الملحق. القراءة المتزامنة مع المشاهدة توفر تجربة تعليمية وثقافية أعمق.
                      </p>
                    </div>
                  </div>

                  {/* تأثير ظل المنتصف (Spine) */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-stone-900/10 to-transparent pointer-events-none hidden md:block"></div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default BookDetail;