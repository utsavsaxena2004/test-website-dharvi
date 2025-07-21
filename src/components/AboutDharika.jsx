import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Users, Palette, Camera, Music, Brush } from 'lucide-react';

const AboutDharika = () => {
  const floatingIcons = [
    { Icon: Sparkles, delay: 0, x: 20, y: 30 },
    { Icon: Heart, delay: 0.5, x: -30, y: 40 },
    { Icon: Palette, delay: 1, x: 40, y: 20 },
    { Icon: Camera, delay: 1.5, x: -20, y: 50 },
    { Icon: Music, delay: 2, x: 30, y: 10 },
    { Icon: Brush, delay: 2.5, x: -40, y: 30 },
  ];

  const FloatingIcon = ({ Icon, delay, x, y }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.3, 0],
        scale: [0, 1, 0],
        x: [0, x, 0],
        y: [0, y, 0],
      }}
      transition={{
        duration: 8,
        delay: delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }}
      className="absolute text-primary/20"
    >
      <Icon size={24} />
    </motion.div>
  );

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-background via-muted/10 to-primary/5">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating geometric shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-32 h-32 border-2 border-primary/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-24 h-24 border-2 border-accent/10 rounded-full"
        />
        
        {/* Floating icons */}
        <div className="absolute inset-0">
          {floatingIcons.map((icon, index) => (
            <div key={index} className={`absolute ${index % 2 === 0 ? 'top-1/4' : 'bottom-1/4'} ${index % 3 === 0 ? 'left-1/4' : 'right-1/4'}`}>
              <FloatingIcon {...icon} />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {/* Decorative line with sparkle */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            transition={{ delay: 0.2, duration: 1 }}
            viewport={{ once: true }}
            className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"
          />
          
          {/* Hindi Subtitle with decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <Sparkles className="text-primary w-5 h-5" />
            <p className="text-xl text-primary font-medium tracking-wide">
              हम से आप तक
            </p>
            <Sparkles className="text-primary w-5 h-5" />
          </motion.div>
          
          {/* Main Title with gradient text */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          >
            Welcome to Dharika.
          </motion.h2>
          
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "200px" }}
            transition={{ delay: 0.8, duration: 1.2 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Story content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative  rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Our Story</h3>
                </div>
                
                <div className="space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed">
                  <p className="text-foreground/90">
                    Hi, I'm <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">Siya</span> — the 18-year-old behind this chaos, colour, and community.
                  </p>
                  
                  <p className="text-foreground/80">
                    What started in the middle of a noisy college canteen (yes, over cold fries and a barely-finished project brief) somehow turned into this. Dharika wasn't born out of a pitch deck — it was born because we were given a project which needed to be done in 2 Hours. Who knew we would still be working on it months later.
                  </p>
                  
                  <p className="text-foreground/80">
                    Today, Dharika is built by a crew of students, creators, and daydreamers — all under 20 — who are designing, shooting, writing, building, and figuring it out, together.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Mission & Values */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative rounded-3xl p-8 ">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                </div>
                
                <div className="space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed">
                  <p className="text-lg sm:text-xl font-bold text-primary">
                    More than a brand, Dharika is a shared space.
                  </p>
                  
                  <p className="text-foreground/80">
                    It's where fashion meets art, meets storytelling, meets everyone who's ever wanted to do their own thing and be seen for it — whether you're a dancer, designer, chef, stylist, or someone still deciding.
                  </p>
                  
                  <div className="rounded-2xl p-6">
                    <p className="text-foreground/90 mb-3">
                      Our very first bio read:
                    </p>
                    <p className="text-2xl font-bold text-primary mb-3">
                      "वसुधैव कुटुम्बकम्"
                    </p>
                    <p className="text-sm text-foreground/70 italic">
                      — the world is one family.
                    </p>
                    <p className="text-foreground/80 mt-3">
                      That spirit still drives everything we do.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom section - Welcome message */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="relative inline-block">
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-2xl" />
            <div className="relative rounded-3xl p-12 text-black ">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-12 h-12 mx-auto mb-6" />
              </motion.div>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                If you've made it this far, welcome.
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium opacity-90">
                You're part of the family already. 💛
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutDharika;