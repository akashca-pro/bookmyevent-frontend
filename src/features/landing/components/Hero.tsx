import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { NeonButton } from "../../../components/shared/NeonButton";
import { GlassCard } from "../../../components/shared/GlassCard";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neon-blue text-sm mb-6"
                    >
                        <Sparkles size={14} />
                        <span>The Future of Event Booking</span>
                    </motion.div>

                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white">
                        Experience <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-500 to-neon-purple animate-gradient">
                            Zero Gravity
                        </span>{" "}
                        Services
                    </h1>

                    <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                        Discover a curated universe of premium event services. From holographic venues to AI-assisted planning, we bring the future to your events today.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link to="/signup">
                            <NeonButton className="h-12 px-8 text-lg">
                                Get Started <ArrowRight className="ml-2 w-5 h-5" />
                            </NeonButton>
                        </Link>
                        <Link to="/login">
                            <NeonButton variant="secondary" className="h-12 px-8 text-lg">
                                Explore Services
                            </NeonButton>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative lg:h-[600px] flex items-center justify-center"
                >
                    <div className="relative w-full aspect-square max-w-[500px]">
                        {/* Abstract floating UI elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-0 right-10 z-20"
                        >
                            <GlassCard className="p-4 flex items-center gap-4 w-64">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-blue-600 flex items-center justify-center">
                                    <Sparkles className="text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Status</div>
                                    <div className="font-semibold text-white">Premium Verified</div>
                                </div>
                            </GlassCard>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-10 left-0 z-20"
                        >
                            <GlassCard className="p-4 w-72">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-2xl font-bold text-white">98%</span>
                                    <span className="text-neon-green text-sm">+2.4%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[98%] bg-neon-green" />
                                </div>
                                <div className="mt-2 text-sm text-gray-400">Customer Satisfaction</div>
                            </GlassCard>
                        </motion.div>

                        {/* Central Graphic */}
                        <div className="absolute inset-20 bg-gradient-to-tr from-neon-purple to-neon-blue rounded-full blur-[80px] opacity-40 animate-pulse" />
                        <img
                            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000"
                            alt="Event Hero"
                            className="absolute inset-4 rounded-2xl object-cover opacity-80 mix-blend-overlay mask-image-gradient"
                            style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
