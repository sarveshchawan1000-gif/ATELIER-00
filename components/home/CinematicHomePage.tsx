'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ProductWithDetails, Collection } from '@/lib/db/types';
import { HeroSection } from './HeroSection';
import { MarqueeSection } from './MarqueeSection';
import { StatementSection } from './StatementSection';
import { FeaturedSection } from './FeaturedSection';
import { CollectionsCarousel } from './CollectionsCarousel';
import { StorySection } from './StorySection';
import { NewDropsSection } from './NewDropsSection';
import { FinalCtaSection } from './FinalCtaSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CinematicHomePageProps {
  featuredProducts: ProductWithDetails[];
  newArrivals: ProductWithDetails[];
  collections: Collection[];
}

export function CinematicHomePage({
  featuredProducts,
  newArrivals,
  collections,
}: CinematicHomePageProps) {
  const mainRef = useRef<HTMLElement>(null);

  // Hero refs
  const heroImageRef = useRef<HTMLDivElement>(null);
  const wordmarkLeftRef = useRef<HTMLSpanElement>(null);
  const wordmarkRightRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  // Marquee refs
  const marqueeTrack1Ref = useRef<HTMLDivElement>(null);
  const marqueeTrack2Ref = useRef<HTMLDivElement>(null);
  const marqueeImageRef = useRef<HTMLDivElement>(null);

  // Statement refs
  const statementLine1Ref = useRef<HTMLSpanElement>(null);
  const statementLine2Ref = useRef<HTMLSpanElement>(null);
  const statementLine3Ref = useRef<HTMLSpanElement>(null);

  // Section container refs
  const featuredSectionRef = useRef<HTMLDivElement>(null);
  const newDropsSectionRef = useRef<HTMLDivElement>(null);

  // Story refs
  const storyImageRef = useRef<HTMLDivElement>(null);
  const storyTextRef = useRef<HTMLDivElement>(null);

  // Final CTA refs
  const finalCtaImageRef = useRef<HTMLDivElement>(null);
  const finalCtaContentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // =========================================================================
      // 1. REDUCED MOTION BRANCH
      // =========================================================================
      mm.add('(prefers-reduced-motion: reduce)', () => {
        // Instant visibility, gentle opacity fades only (<= 200ms)
        if (heroImageRef.current) gsap.set(heroImageRef.current, { scale: 1, opacity: 1 });
        if (wordmarkLeftRef.current) gsap.set(wordmarkLeftRef.current, { x: 0, opacity: 1 });
        if (wordmarkRightRef.current) gsap.set(wordmarkRightRef.current, { x: 0, opacity: 1 });
        if (taglineRef.current) gsap.set(taglineRef.current, { opacity: 1, y: 0 });

        if (marqueeTrack1Ref.current) gsap.set(marqueeTrack1Ref.current, { x: 0 });
        if (marqueeTrack2Ref.current) gsap.set(marqueeTrack2Ref.current, { x: 0 });

        if (statementLine1Ref.current) gsap.set(statementLine1Ref.current, { y: 0, opacity: 1 });
        if (statementLine2Ref.current) gsap.set(statementLine2Ref.current, { y: 0, opacity: 1 });
        if (statementLine3Ref.current) gsap.set(statementLine3Ref.current, { y: 0, opacity: 1 });
      });

      // =========================================================================
      // 2. DESKTOP ANIMATION SYSTEM (min-width: 768px, no reduced motion)
      // =========================================================================
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const hasPlayed = typeof window !== 'undefined' && sessionStorage.getItem('zipup_intro_played') === 'true';

        // 01 HERO ENTRANCE TIMELINE
        const heroTl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            try {
              sessionStorage.setItem('zipup_intro_played', 'true');
            } catch (e) {}
          },
        });

        // Fast bypass on scroll or key press
        const skipEntrance = () => {
          if (heroTl.isActive()) {
            heroTl.progress(1);
          }
        };
        window.addEventListener('scroll', skipEntrance, { once: true, passive: true });
        window.addEventListener('keydown', skipEntrance, { once: true });

        if (!hasPlayed) {
          // Full 1,300ms Entrance
          heroTl
            .fromTo(
              heroImageRef.current,
              { scale: 1.08 },
              { scale: 1.0, duration: 1.3, ease: 'power2.out' },
              0
            )
            .fromTo(
              wordmarkLeftRef.current,
              { x: '-100vw', opacity: 0.8 },
              { x: 0, opacity: 1, duration: 0.9, ease: 'cubic-bezier(0.22, 1, 0.36, 1)' },
              0.25
            )
            .fromTo(
              wordmarkRightRef.current,
              { x: '100vw', opacity: 0.8 },
              { x: 0, opacity: 1, duration: 0.9, ease: 'cubic-bezier(0.22, 1, 0.36, 1)' },
              0.25
            )
            .fromTo(
              taglineRef.current,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
              0.85
            );
        } else {
          // Fast 350ms Repeat Entry
          heroTl
            .fromTo(
              heroImageRef.current,
              { scale: 1.04 },
              { scale: 1.0, duration: 0.4, ease: 'power2.out' },
              0
            )
            .fromTo(
              wordmarkLeftRef.current,
              { x: -60, opacity: 0.5 },
              { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
              0
            )
            .fromTo(
              wordmarkRightRef.current,
              { x: 60, opacity: 0.5 },
              { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
              0
            )
            .fromTo(
              taglineRef.current,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
              0.1
            );
        }

        // HERO SCROLL PARALLAX
        if (heroImageRef.current) {
          gsap.to(heroImageRef.current, {
            yPercent: 18,
            ease: 'none',
            scrollTrigger: {
              trigger: heroImageRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        // 02 MARQUEE SCROLL TRIGGER (OPPOSING TRACKS + PARALLAX PHOTO)
        if (marqueeTrack1Ref.current && marqueeTrack2Ref.current) {
          gsap.fromTo(
            marqueeTrack1Ref.current,
            { x: '-25%' },
            {
              x: '0%',
              ease: 'none',
              scrollTrigger: {
                trigger: marqueeTrack1Ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
              },
            }
          );

          gsap.fromTo(
            marqueeTrack2Ref.current,
            { x: '0%' },
            {
              x: '-25%',
              ease: 'none',
              scrollTrigger: {
                trigger: marqueeTrack2Ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
              },
            }
          );
        }

        if (marqueeImageRef.current) {
          gsap.fromTo(
            marqueeImageRef.current,
            { y: 35 },
            {
              y: -35,
              ease: 'none',
              scrollTrigger: {
                trigger: marqueeImageRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            }
          );
        }

        // 03 STATEMENT SECTION REVEAL (CLIP-PATH + TRANSLATEY, ONCE)
        const statementLines = [
          statementLine1Ref.current,
          statementLine2Ref.current,
          statementLine3Ref.current,
        ].filter(Boolean);

        if (statementLines.length > 0) {
          gsap.fromTo(
            statementLines,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.12,
              ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
              scrollTrigger: {
                trigger: statementLines[0],
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        // 04 FEATURED PRODUCTS CARD STAGGER
        const featuredCards = document.querySelectorAll('.featured-card');
        if (featuredCards.length > 0) {
          gsap.fromTo(
            featuredCards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: featuredSectionRef.current,
                start: 'top 75%',
                once: true,
              },
            }
          );
        }

        // 06 STORY SECTION PARALLAX
        if (storyImageRef.current && storyTextRef.current) {
          gsap.fromTo(
            storyImageRef.current,
            { y: 30 },
            {
              y: -30,
              ease: 'none',
              scrollTrigger: {
                trigger: storyImageRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
              },
            }
          );

          gsap.fromTo(
            storyTextRef.current,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: storyTextRef.current,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }

        // 07 NEW DROPS DIRECTIONAL STAGGER REVEAL
        const newDropCards = document.querySelectorAll('.new-drop-card');
        if (newDropCards.length > 0) {
          gsap.fromTo(
            newDropCards,
            {
              y: 35,
              x: (index) => (index % 2 === 0 ? -24 : 24),
              opacity: 0,
            },
            {
              y: 0,
              x: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: newDropsSectionRef.current,
                start: 'top 75%',
                once: true,
              },
            }
          );
        }

        // 08 FINAL CTA SCALE & CONTENT REVEAL
        if (finalCtaImageRef.current) {
          gsap.fromTo(
            finalCtaImageRef.current,
            { scale: 1.0 },
            {
              scale: 1.08,
              ease: 'none',
              scrollTrigger: {
                trigger: finalCtaImageRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        if (finalCtaContentRef.current) {
          gsap.fromTo(
            finalCtaContentRef.current,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: finalCtaContentRef.current,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }
      });

      // =========================================================================
      // 3. MOBILE ANIMATION SYSTEM (max-width: 767px, no reduced motion)
      // =========================================================================
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        // Streamlined Mobile Entrance
        const mobileHeroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        mobileHeroTl
          .fromTo(
            wordmarkLeftRef.current,
            { x: -50, opacity: 0.5 },
            { x: 0, opacity: 1, duration: 0.5 },
            0.1
          )
          .fromTo(
            wordmarkRightRef.current,
            { x: 50, opacity: 0.5 },
            { x: 0, opacity: 1, duration: 0.5 },
            0.1
          )
          .fromTo(
            taglineRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.4 },
            0.4
          );

        // Mobile Marquee Track
        if (marqueeTrack1Ref.current && marqueeTrack2Ref.current) {
          gsap.fromTo(
            marqueeTrack1Ref.current,
            { x: '-15%' },
            {
              x: '0%',
              ease: 'none',
              scrollTrigger: {
                trigger: marqueeTrack1Ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.3,
              },
            }
          );
        }

        // Mobile Reveal for Statement
        const statementLines = [
          statementLine1Ref.current,
          statementLine2Ref.current,
          statementLine3Ref.current,
        ].filter(Boolean);

        if (statementLines.length > 0) {
          gsap.fromTo(
            statementLines,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              scrollTrigger: {
                trigger: statementLines[0],
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      });

      // Refresh ScrollTrigger after initial mount layout settle
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => {
        clearTimeout(refreshTimeout);
        mm.revert();
      };
    },
    { scope: mainRef }
  );

  return (
    <main ref={mainRef} className="flex-1 flex flex-col bg-cream overflow-clip">
      {/* 01 HERO SECTION */}
      <HeroSection
        heroImageRef={heroImageRef}
        wordmarkLeftRef={wordmarkLeftRef}
        wordmarkRightRef={wordmarkRightRef}
        taglineRef={taglineRef}
      />

      {/* 02 MARQUEE SECTION */}
      <MarqueeSection
        marqueeTrack1Ref={marqueeTrack1Ref}
        marqueeTrack2Ref={marqueeTrack2Ref}
        marqueeImageRef={marqueeImageRef}
      />

      {/* 03 MOVEMENT STATEMENT */}
      <StatementSection
        statementLine1Ref={statementLine1Ref}
        statementLine2Ref={statementLine2Ref}
        statementLine3Ref={statementLine3Ref}
      />

      {/* 04 FEATURED PRODUCTS */}
      <FeaturedSection
        products={featuredProducts}
        sectionRef={featuredSectionRef}
      />

      {/* 05 COLLECTIONS CAROUSEL */}
      <CollectionsCarousel
        collections={collections}
        products={newArrivals}
      />

      {/* 06 ZIPUP NATION STORY */}
      <StorySection
        storyImageRef={storyImageRef}
        storyTextRef={storyTextRef}
      />

      {/* 07 NEW DROPS */}
      <NewDropsSection
        products={newArrivals}
        sectionRef={newDropsSectionRef}
      />

      {/* 08 FINAL CTA */}
      <FinalCtaSection
        finalCtaImageRef={finalCtaImageRef}
        finalCtaContentRef={finalCtaContentRef}
      />
    </main>
  );
}
