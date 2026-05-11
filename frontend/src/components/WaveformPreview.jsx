import { motion } from 'framer-motion';

const WaveformPreview = ({ color = "indigo" }) => {
    // Generate random bar heights for a "waveform" look
    const bars = Array.from({ length: 20 }, () => Math.floor(Math.random() * 60) + 20);

    return (
        <div className="flex items-center justify-center gap-[2px] h-full w-full opacity-80">
            {bars.map((height, i) => (
                <motion.div
                    key={i}
                    initial={{ height: '20%' }}
                    animate={{
                        height: [`${height}%`, `${height * 0.5}%`, `${height}%`],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.05,
                    }}
                    className={`w-1 rounded-full ${color === 'indigo' ? 'bg-accent-primary' :
                            color === 'violet' ? 'bg-accent-secondary' : 'bg-accent-success'
                        }`}
                    style={{ maxHeight: '100%' }}
                />
            ))}
        </div>
    );
};

export default WaveformPreview;
