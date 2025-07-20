import React from 'react';
import { motion } from 'framer-motion';

const AboutDharika = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Hindi Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground mb-4 font-medium"
          >
            हम से आप तक
          </motion.p>
          
          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-16"
          >
            Welcome to Dharika.
          </motion.h2>
        </motion.div>

        <div className="space-y-8 text-lg leading-relaxed">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50"
          >
            <p className="text-foreground/90 mb-6">
              Hi, I'm <span className="font-semibold text-primary">Siya</span> — the 18-year-old behind this chaos, colour, and community.
            </p>
            
            <p className="text-foreground/80 mb-6">
              What started in the middle of a noisy college canteen (yes, over cold fries and a barely-finished project brief) somehow turned into this. Dharika wasn't born out of a pitch deck — it was born because we were given a project which needed to be done in 2 Hours. Who knew we would still be working on it months later.
            </p>
            
            <p className="text-foreground/80">
              Today, Dharika is built by a crew of students, creators, and daydreamers — all under 20 — who are designing, shooting, writing, building, and figuring it out, together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20"
          >
            <p className="text-foreground/90 mb-6 font-medium">
              <span className="text-primary">More than a brand, Dharika is a shared space.</span>
            </p>
            
            <p className="text-foreground/80 mb-6">
              It's where fashion meets art, meets storytelling, meets everyone who's ever wanted to do their own thing and be seen for it — whether you're a dancer, designer, chef, stylist, or someone still deciding.
            </p>
            
            <p className="text-foreground/80 mb-6">
              Our very first bio read: <span className="font-semibold text-primary">"वसुधैव कुटुम्बकम्"</span> — the world is one family.
              <br />
              That spirit still drives everything we do.
            </p>
            
            <p className="text-foreground/90 text-xl font-medium">
              If you've made it this far, welcome.
              <br />
              <span className="text-primary">You're part of the family already. 💛</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutDharika;