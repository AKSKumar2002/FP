import React, { useState } from 'react';

const Blog = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const blogPosts = [
        { id: 1, title: "10 Amazing Health Benefits of Organic Spinach", excerpt: "Discover why organic spinach is a superfood powerhouse packed with nutrients, antioxidants, and essential vitamins for your health.", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80", category: "Health", author: "Dr. Sarah Green", date: "Dec 15, 2025", readTime: "5 min read", tags: ["Greens", "Nutrition", "Organic"], views: "2.3K", likes: "145" },
        { id: 2, title: "Why Organic Vegetables Are Worth Every Penny", excerpt: "Learn about the real value of organic produce and how it benefits your health, the environment, and local farmers.", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80", category: "Organic Living", author: "Farm Pick Team", date: "Dec 14, 2025", readTime: "7 min read", tags: ["Organic", "Sustainability", "Farming"], views: "3.1K", likes: "198" },
        { id: 3, title: "Fresh Fruit Guide: Seasonal Picks for Winter", excerpt: "Explore the best seasonal fruits for winter and how they boost your immunity during the cold months.", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80", category: "Fruits", author: "Chef Maria", date: "Dec 13, 2025", readTime: "6 min read", tags: ["Fruits", "Seasonal", "Winter"], views: "1.8K", likes: "132" },
        { id: 4, title: "The Ultimate Guide to Growing Your Own Herbs", excerpt: "Start your home herb garden with these easy tips and tricks. Fresh herbs make every meal healthier and tastier!", image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80", category: "Gardening", author: "John Farmer", date: "Dec 12, 2025", readTime: "8 min read", tags: ["Herbs", "Gardening", "DIY"], views: "4.2K", likes: "267" },
        { id: 5, title: "Detox Naturally with Green Juice Recipes", excerpt: "Refresh and rejuvenate your body with these power-packed green juice recipes made from fresh organic greens.", image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80", category: "Health", author: "Dr. Sarah Green", date: "Dec 11, 2025", readTime: "4 min read", tags: ["Greens", "Detox", "Recipes"], views: "2.9K", likes: "176" },
        { id: 6, title: "Farm-to-Table: The Journey of Your Vegetables", excerpt: "Ever wondered how your organic veggies reach your table? Take a behind-the-scenes look at our farm-to-table process.", image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80", category: "Farm Life", author: "Farm Pick Team", date: "Dec 10, 2025", readTime: "6 min read", tags: ["Farm", "Process", "Sustainability"], views: "3.5K", likes: "203" },
        { id: 7, title: "Top 15 Antioxidant-Rich Berries You Should Eat", excerpt: "Boost your health with nature's candy! Learn about the most powerful antioxidant berries and their amazing benefits.", image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=80", category: "Fruits", author: "Chef Maria", date: "Dec 9, 2025", readTime: "6 min read", tags: ["Berries", "Antioxidants", "Health"], views: "2.1K", likes: "154" },
        { id: 8, title: "Composting 101: Turn Waste into Garden Gold", excerpt: "Learn the art of composting and create nutrient-rich soil for your garden while reducing waste.", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", category: "Gardening", author: "John Farmer", date: "Dec 8, 2025", readTime: "7 min read", tags: ["Composting", "Sustainability", "Gardening"], views: "1.9K", likes: "128" },
        { id: 9, title: "5 Superfoods for Boosting Immunity Naturally", excerpt: "Strengthen your immune system with these powerful organic superfoods backed by science.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80", category: "Health", author: "Dr. Sarah Green", date: "Dec 7, 2025", readTime: "5 min read", tags: ["Immunity", "Superfoods", "Health"], views: "5.2K", likes: "312" }
    ];

    const categories = ['All', 'Health', 'Organic Living', 'Fruits', 'Gardening', 'Farm Life'];
    const filteredPosts = selectedCategory === 'All' ? blogPosts : blogPosts.filter(post => post.category === selectedCategory);
    const featuredPost = blogPosts[0];
    const trendingPosts = blogPosts.slice(1, 4);
    const editorsPicks = [blogPosts[4], blogPosts[8]];

    const popularCategories = [
        { name: "Health & Wellness", icon: "💚", count: 42, color: "from-green-400 to-emerald-500", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80" },
        { name: "Organic Recipes", icon: "🥗", count: 38, color: "from-lime-400 to-green-500", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
        { name: "Gardening Tips", icon: "🌿", count: 35, color: "from-teal-400 to-cyan-500", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
        { name: "Farm Stories", icon: "🚜", count: 28, color: "from-emerald-400 to-teal-500", image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80" }
    ];

    const experts = [
        { name: "Dr. Sarah Green", title: "Nutrition Expert", avatar: "https://i.pravatar.cc/150?img=1", articles: 12, specialty: "Health & Nutrition" },
        { name: "Chef Maria", title: "Organic Chef", avatar: "https://i.pravatar.cc/150?img=5", articles: 18, specialty: "Recipes & Cooking" },
        { name: "John Farmer", title: "Master Gardener", avatar: "https://i.pravatar.cc/150?img=12", articles: 15, specialty: "Gardening & Farming" }
    ];

    const stats = [
        { number: "500+", label: "Articles Published", icon: "📝" },
        { number: "50K+", label: "Active Readers", icon: "👥" },
        { number: "12+", label: "Expert Contributors", icon: "⭐" },
        { number: "95%", label: "Reader Satisfaction", icon: "❤️" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-white">
            {/* ENHANCED STUNNING BANNER SECTION */}
            <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden min-h-[600px] md:min-h-[700px]">
                {/* Animated Mesh Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-transparent"></div>

                {/* Animated Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        animation: 'drift 20s linear infinite'
                    }}></div>
                </div>

                {/* Floating Orbs with Enhanced Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-white/20 to-green-300/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-emerald-300/10 to-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-300/10 to-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                </div>

                {/* Floating Emoji Vegetables/Fruits */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-[10%] text-6xl opacity-30 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}>🥬</div>
                    <div className="absolute top-40 right-[15%] text-5xl opacity-25 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🥕</div>
                    <div className="absolute bottom-32 left-[20%] text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🍅</div>
                    <div className="absolute bottom-40 right-[25%] text-6xl opacity-30 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '2s' }}>🥦</div>
                    <div className="absolute top-1/2 left-[8%] text-5xl opacity-25 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1.5s' }}>🌽</div>
                    <div className="absolute top-1/3 right-[10%] text-8xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '2.5s' }}>🍊</div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto relative z-10 px-6 py-20 md:py-28">
                    <div className="text-center">
                        {/* Badge with Glow Effect */}
                        <div className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-sm font-semibold shadow-2xl border border-white/30 animate-fadeIn" style={{ boxShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            <span>🌱 Your Organic Living Hub</span>
                        </div>

                        {/* Main Heading with Gradient Text Effect */}
                        <h1 className="text-6xl md:text-8xl font-black mb-6 animate-fadeIn leading-tight tracking-tight">
                            <span className="inline-block transform hover:scale-105 transition-transform duration-300">Farm</span>
                            {' '}
                            <span className="inline-block transform hover:scale-105 transition-transform duration-300 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-green-200 to-emerald-200">
                                Pick
                            </span>
                            {' '}
                            <span className="inline-block transform hover:scale-105 transition-transform duration-300">Blog</span>
                        </h1>

                        {/* Subtitle with Better Typography */}
                        <p className="text-xl md:text-3xl text-green-50 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
                            Discover <span className="font-semibold text-white">expert insights</span> on organic living,
                            <br className="hidden md:block" />
                            nutrition, gardening, and <span className="font-semibold text-white">sustainable farming</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <button className="group px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                                <span>Explore Articles</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                            <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                                <span>Subscribe Free</span>
                                <span className="text-2xl">📬</span>
                            </button>
                        </div>

                        {/* Enhanced Stats Cards with 3D Effect */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-white/20 animate-fadeIn"
                                    style={{
                                        animationDelay: `${index * 0.15}s`,
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                                    }}
                                >
                                    {/* Glow Effect on Hover */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-500"></div>

                                    <div className="relative z-10">
                                        <div className="text-5xl md:text-6xl mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{stat.icon}</div>
                                        <div className="text-4xl md:text-5xl font-black mb-2 text-white drop-shadow-lg">{stat.number}</div>
                                        <div className="text-xs md:text-sm text-green-100 font-semibold uppercase tracking-wider">{stat.label}</div>
                                    </div>

                                    {/* Animated Border */}
                                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                                        backgroundSize: '200% 200%',
                                        animation: 'shimmer 3s infinite'
                                    }}></div>
                                </div>
                            ))}
                        </div>

                        {/* Scroll Indicator */}
                        <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
                            <span className="text-sm text-green-100 font-semibold">Scroll to explore</span>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Bottom Wave Decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-16 md:h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white" />
                    </svg>
                </div>

                {/* Add shimmer animation */}
                <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes drift {
            0% { transform: translate(0, 0); }
            50% { transform: translate(10px, 10px); }
            100% { transform: translate(0, 0); }
          }
        ` }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Trending Section - keeping implementation brief for length */}
                <div className="mb-20">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8">🔥 Trending Now</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {trendingPosts.map((post, idx) => (
                            <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2">
                                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4">#{idx + 1}</div>
                                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                <p className="text-sm text-gray-600">{post.views} views • {post.likes} likes</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Categories */}
                <div className="mb-20">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8">📚 Popular Categories</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {popularCategories.map((cat, idx) => (
                            <div key={idx} className={`relative h-48 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition`}>
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-80 flex flex-col items-center justify-center text-white`}>
                                    <div className="text-5xl mb-2">{cat.icon}</div>
                                    <h3 className="text-xl font-bold">{cat.name}</h3>
                                    <p className="text-sm">{cat.count} Articles</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">📖 All Articles</h2>
                    <div className="flex flex-wrap gap-3 mb-8">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-3 rounded-full font-semibold transition shadow-md ${selectedCategory === cat ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-white text-gray-700 border-2'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {filteredPosts.map(post => (
                        <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2">
                            <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                            <div className="p-6">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{post.category}</span>
                                <h3 className="text-xl font-bold text-gray-800 mt-3 mb-2">{post.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{post.excerpt.substring(0, 100)}...</p>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>{post.views} views • {post.likes} likes</span>
                                    <button className="text-green-600 font-semibold">Read →</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
