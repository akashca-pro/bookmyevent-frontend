import { motion } from "framer-motion";
import { GlassCard } from "../../../components/shared/GlassCard";
import { ShieldCheck, Zap, Globe, Clock } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Smart Discovery",
        description: "Browse event services by category, price range, and location with powerful search and filters.",
        color: "text-neon-blue",
    },
    {
        icon: Clock,
        title: "Real-Time Availability",
        description: "Check service availability instantly with our live calendar system before you book.",
        color: "text-neon-green",
    },
    {
        icon: ShieldCheck,
        title: "Secure Booking",
        description: "Reserve services with a 5-minute confirmation window to ensure your preferred slot.",
        color: "text-purple-400",
    },
    {
        icon: Globe,
        title: "Booking Management",
        description: "Track, manage, and view all your bookings in one simple and intuitive dashboard.",
        color: "text-pink-400",
    },
];

export const Features = () => {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4"
                    >
                        Why Choose <span className="text-neon-blue">BookMyEvent</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        We redefined the standards of event planning with cutting-edge technology.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="h-full hover:bg-white/10" hoverEffect>
                                <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${feature.color}`}>
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
