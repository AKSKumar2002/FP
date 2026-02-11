import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Calendar,
    Clock,
    ChevronRight,
    User,
    TrendingUp,
    Award,
    Heart,
    Share2,
    ArrowRight,
    SearchX,
    Leaf,
    Apple,
    Sprout,
    Zap,
    MessageCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Blog = () => {
    const { navigate } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const blogPosts = [
        {
            id: 1,
            title: "10 Amazing Health Benefits of Organic Spinach You Didn't Know",
            excerpt: "Discover why organic spinach is a superfood powerhouse packed with nitrates, antioxidants, and essential vitamins that can transform your cardiovascular health and boost energy levels naturally.",
            image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=1200&q=80",
            category: "Health",
            author: "Dr. Sarah Green",
            date: "Feb 10, 2026",
            readTime: "5 min read",
            tags: ["Greens", "Nutrition", "Organic"],
            views: "12.4K",
            likes: "842",
            featured: true
        },
        {
            id: 2,
            title: "Why Regenerative Agriculture is the Future of Our Food System",
            excerpt: "Learn how moving beyond organic to regenerative farming practices can heal our soil, capture carbon, and produce more nutrient-dense vegetables for your family.",
            image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
            category: "Sustainability",
            author: "Alex Rivera",
            date: "Feb 08, 2026",
            readTime: "7 min read",
            tags: ["Eco", "Soil-Health", "Farming"],
            views: "8.1K",
            likes: "567"
        },
        {
            id: 3,
            title: "The Ultimate Seasonal Guide: Best Fruits to Eat This Winter",
            excerpt: "Explore the most potent immunity-boosting fruits available this season. From citrus bursts to antioxidant-rich berries, here's what should be in your basket.",
            image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80",
            category: "Nutrition",
            author: "Chef Mike",
            date: "Feb 05, 2026",
            readTime: "6 min read",
            tags: ["Fruits", "Immunity", "Winter"],
            views: "15.2K",
            likes: "1.2K"
        },
        {
            id: 4,
            title: "Kitchen Herb Gardening: From Windowsill to Your Dinner Plate",
            excerpt: "Start your indoor herb garden with these expert tips. We cover everything from light requirements to the best potting mixes for basil, mint, and rosemary.",
            image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
            category: "DIY",
            author: "Liam Thorne",
            date: "Jan 28, 2026",
            readTime: "10 min read",
            tags: ["Herbs", "Gardening", "Home"],
            views: "22.6K",
            likes: "2.4K"
        },
        {
            id: 5,
            title: "Detox Myths vs. Reality: A Science-Based Approach",
            excerpt: "Stop falling for expensive 'cleanses'. Learn how your body's natural detox processes work and how high-fiber organic greens support them effectively.",
            image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80",
            category: "Health",
            author: "Dr. Sarah Green",
            date: "Jan 22, 2026",
            readTime: "8 min read",
            tags: ["Science", "Detox", "Wellness"],
            views: "18.9K",
            likes: "1.1K"
        },
        {
            id: 6,
            title: "Behind the Scenes: A Day at Farm Pick Primary Fields",
            excerpt: "Take a walking tour through our Coimbatore fields. See how we manage pests without chemicals and select the perfect produce for your morning delivery.",
            image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
            category: "Lifestyle",
            author: "Farmer Raj",
            date: "Jan 15, 2026",
            readTime: "4 min read",
            tags: ["Farm-Life", "Community", "Local"],
            views: "6.3K",
            likes: "432"
        }
    ];

    const categories = ['All', 'Health', 'Sustainability', 'Nutrition', 'DIY', 'Lifestyle'];

    const filteredPosts = blogPosts.filter(post =>
        selectedCategory === 'All' || post.category === selectedCategory
    );

    const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];

    const stats = [
        { label: "Readers", value: "45K+", color: "text-blue-500" },
        { label: "Authors", value: "24+", color: "text-emerald-500" },
        { label: "Tips", value: "1.2K", color: "text-amber-500" }
    ];

    return (
        <div className="min-h-screen bg-[#FAFBFC] selection:bg-emerald-100 pb-20">
            {/* HERO SECTION */}
            <section className="relative min-h-[85vh] flex items-center py-20 overflow-hidden bg-[#0A0B0B]">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-50 scale-105" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0B0B]/60 to-[#0A0B0B]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0A0B0B] to-transparent"></div>
                </div>

                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full mt-10 md:mt-0">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
                                <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[3px] px-4 py-1.5 rounded-sm">Digital Journal</span>
                                <div className="h-[1px] w-12 bg-white/20"></div>
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[2px]">EST. 2025</span>
                            </div>
                            <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-10">
                                PICK <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-amber-200">FRESH</span> <br />
                                INSIGHTS
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-12 font-medium leading-relaxed mx-auto lg:mx-0">
                                Join our community of 45,000+ healthy living enthusiasts. Expert-backed guides for an organic lifestyle.
                            </p>

                            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4 border-t border-white/5">
                                {stats.map((s, i) => (
                                    <div key={i} className="flex flex-col items-center lg:items-start">
                                        <span className={`text-4xl font-black ${s.color} mb-1 transition-all hover:scale-110`}>{s.value}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[2px]">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="relative max-w-xl mx-auto lg:max-w-none"
                        >
                            <div className="relative z-10 group cursor-pointer" onClick={() => navigate(`/blog/${featuredPost.id}`)}>
                                <div className="absolute -inset-6 bg-emerald-500/10 rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                                <div className="relative overflow-hidden rounded-[3rem] bg-[#141516] border border-white/10 shadow-3xl transition-all duration-500 group-hover:translate-y-[-8px]">
                                    <div className="aspect-[16/11] overflow-hidden">
                                        <img src={featuredPost.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" />
                                    </div>
                                    <div className="p-8 md:p-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md">{featuredPost.category}</span>
                                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                                <Clock size={12} />
                                                {featuredPost.readTime}
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-6 line-clamp-2 leading-[1.1]">
                                            {featuredPost.title}
                                        </h3>
                                        <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-black">{featuredPost.author}</p>
                                                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{featuredPost.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ARTICLES CONTENT */}
            <section className="max-w-7xl mx-auto px-6 py-20 relative z-20">
                {/* CATEGORY BAR */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-gray-100 pb-12">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-[2px] bg-emerald-500"></div>
                        <h2 className="text-3xl font-black tracking-tighter text-gray-900">CURATED ARTICLES</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-900'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* POSTS GRID */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post, index) => (
                                <motion.div
                                    layout
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    className="group h-full"
                                >
                                    <div className="relative h-full flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] group-hover:-translate-y-2">
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                            <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all shadow-lg active:scale-90">
                                                <Heart size={18} fill={post.id === 3 ? "currentColor" : "none"} />
                                            </button>
                                        </div>
                                        <div className="p-8 md:p-10 flex-1 flex flex-col">
                                            <div className="flex items-center gap-4 mb-6">
                                                <span className="text-emerald-500 font-black text-[9px] uppercase tracking-[2px] leading-none bg-emerald-50 px-2.5 py-1.5 rounded-lg">
                                                    {post.category}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-gray-300 font-black text-[9px] uppercase tracking-[2px]">
                                                    <Clock size={12} className="text-emerald-500/40" />
                                                    {post.readTime}
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 mb-5 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm font-medium mb-8 line-clamp-3 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                            <div className="mt-auto flex items-center justify-between pt-8 border-t border-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shadow-sm">
                                                        <img src={`https://i.pravatar.cc/100?u=${post.author}`} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-gray-900 font-black text-[9px] uppercase tracking-widest">{post.author}</span>
                                                </div>
                                                <button className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[3px] group-hover:translate-x-1 transition-all">
                                                    READ MORE
                                                    <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                                    <SearchX className="text-gray-300" size={40} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">No Insights Found</h3>
                                <p className="text-gray-400 font-medium max-w-sm mx-auto">Try adjusting your filters or search terms for better results.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* EXPERT SPOTLIGHT */}
            <section className="bg-white border-y border-gray-100 py-32 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-emerald-500/[0.02] rounded-full blur-[150px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[8px] mb-6 block">Our Community Experts</span>
                        <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">MEET THE PUBLISHERS</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 md:gap-16">
                        {[
                            { name: "Dr. Sarah Green", roles: ["Nutrition Specialist", "Harvard Alumna"], image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80", count: 42 },
                            { name: "Chef Mike Chen", roles: ["Organic Culinary Arts", "3 Michelin Star"], image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80", count: 28 },
                            { name: "Alex Rivera", roles: ["Regenerative Farmer", "Sustainability Envoy"], image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", count: 35 }
                        ].map((expert, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="flex flex-col items-center text-center px-4"
                            >
                                <div className="relative mb-10">
                                    <div className="absolute -inset-4 bg-emerald-500/5 rounded-[4rem] rotate-6 group-hover:rotate-12 transition-all duration-500"></div>
                                    <div className="relative w-48 h-48 rounded-[3.5rem] overflow-hidden ring-8 ring-white shadow-2xl">
                                        <img src={expert.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                                    </div>
                                    <div className="absolute -bottom-4 right-0 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-500">
                                        <Award size={24} />
                                    </div>
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 mb-3">{expert.name}</h4>
                                <div className="space-y-1 mb-8 opacity-60">
                                    {expert.roles.map(r => <p key={r} className="text-[10px] font-black uppercase tracking-widest">{r}</p>)}
                                </div>
                                <div className="inline-flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 transition-colors hover:bg-emerald-50 hover:border-emerald-100">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{expert.count} ARTICLES</span>
                                    <div className="w-[1px] h-3 bg-gray-200"></div>
                                    <ArrowRight className="text-emerald-500" size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWSLETTER */}
            <section className="max-w-7xl mx-auto px-6 py-32">
                <div className="relative bg-[#0A0B0B] rounded-[4rem] p-12 md:p-32 overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
                    <div className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <Zap className="text-amber-300 mb-10 animate-bounce" size={56} fill="currentColor" />
                            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 shadow-black/50">
                                HARVEST <br />
                                <span className="text-emerald-500">FRESH</span> IDEAS.
                            </h2>
                            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-md">
                                Get weekly nutrition tips and exclusive farm deals delivered straight to your inbox.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-3xl">
                            <h4 className="text-white font-black text-xl mb-8 tracking-tight">JOIN 45K+ READERS</h4>
                            <div className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full h-18 px-10 rounded-[1.5rem] border-none outline-none font-black text-sm bg-white/5 focus:bg-white text-white focus:text-gray-900 transition-all placeholder:text-gray-600"
                                />
                                <button className="w-full h-18 bg-emerald-500 text-white rounded-[1.5rem] font-black text-sm hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                                    DISCOVERY NOW
                                </button>
                            </div>
                            <p className="mt-8 text-white/20 text-[9px] font-black uppercase tracking-[4px] text-center">PRIVACY GUARANTEED • NO SPAM</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER CTA */}
            <div className="max-w-7xl mx-auto px-6 py-32 text-center">
                <div className="h-20 w-[1px] bg-gray-100 mx-auto mb-16"></div>
                <MessageCircle className="mx-auto text-emerald-500 mb-8" size={48} />
                <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tighter">WANT TO BECOME A WRITER?</h3>
                <p className="text-gray-400 font-medium mb-12 max-w-lg mx-auto leading-relaxed text-lg">
                    Share your organic journey with our community. We are always looking for passionate voices.
                </p>
                <button className="h-16 px-12 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group">
                    <span className="flex items-center gap-4 text-gray-900 font-black text-xs uppercase tracking-[4px]">
                        APPLY NOW
                        <ArrowRight className="group-hover:translate-x-2 transition-transform text-emerald-500" size={18} />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Blog;
