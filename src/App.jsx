import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   FOOD DATA
========================================================= */

const foodItems = [
  {
    id: 1,
    name: "Bakery Surprise Box",
    type: "BAKERY",
    price: "₹89",
    oldPrice: "₹240",
    time: "18 MIN LEFT",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 2,
    name: "Midnight Pizza",
    type: "PIZZA",
    price: "₹129",
    oldPrice: "₹390",
    time: "32 MIN LEFT",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 3,
    name: "Burger Rescue",
    type: "BURGER",
    price: "₹109",
    oldPrice: "₹310",
    time: "11 MIN LEFT",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: 4,
    name: "Fresh Bowl",
    type: "HEALTHY",
    price: "₹149",
    oldPrice: "₹360",
    time: "44 MIN LEFT",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85",
  },
];

/* =========================================================
   IMAGE
========================================================= */

function FoodImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`food-image-wrap ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="image-fallback">
          <span>🍴</span>
          <small>FRESH RESCUE</small>
        </div>
      )}

      <div className="image-glow" />
    </div>
  );
}

/* =========================================================
   STEAM
========================================================= */

function Steam() {
  return (
    <div className="steam-system" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="steam-particle"
          style={{
            "--delay": `${i * 0.45}s`,
            "--x": `${(i - 3.5) * 18}px`,
            "--duration": `${4 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   FLOATING PARTICLES
========================================================= */

function FoodParticles() {
  const particles = Array.from({ length: 30 });

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            "--x": `${Math.random() * 100}%`,
            "--y": `${Math.random() * 100}%`,
            "--delay": `${Math.random() * 5}s`,
            "--size": `${2 + Math.random() * 5}px`,
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   FOOD CARD
========================================================= */

function FoodCard({ item, onRescue }) {
  const cardRef = useRef(null);

  const handleMove = (event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.35,
      ease: "power2.out",
      transformPerspective: 900,
    });
  };

  const handleLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  return (
    <article
      ref={cardRef}
      className="food-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="food-card-image">
        <FoodImage src={item.image} alt={item.name} />

        <div className="food-badge">{item.time}</div>

        <div className="food-card-shine" />
      </div>

      <div className="food-card-content">
        <div className="food-card-type">{item.type}</div>

        <h3>{item.name}</h3>

        <div className="food-price-row">
          <strong>{item.price}</strong>
          <del>{item.oldPrice}</del>
        </div>

        <button
          className="rescue-button"
          onClick={() => onRescue(item)}
        >
          <span>RESCUE IT</span>
          <span className="arrow">↗</span>
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [rescued, setRescued] = useState(null);

  const cursorRef = useRef(null);

  /* -------------------------------------------------------
     LOADER
  ------------------------------------------------------- */

  useEffect(() => {
    // IMPORTANT:
    // The loader now has a guaranteed exit.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  /* -------------------------------------------------------
     LENIS
  ------------------------------------------------------- */

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    let rafId;

    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  /* -------------------------------------------------------
     MAIN ANIMATIONS
  ------------------------------------------------------- */

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      /* HERO */

      gsap.from(".hero-kicker", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.15,
      });

      gsap.from(".hero-line", {
        opacity: 0,
        y: 120,
        stagger: 0.12,
        duration: 1.25,
        ease: "power4.out",
      });

      gsap.from(".hero-food", {
        opacity: 0,
        scale: 0.65,
        rotate: -12,
        duration: 1.4,
        delay: 0.25,
        ease: "back.out(1.4)",
      });

      gsap.from(".hero-copy", {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.5,
      });

      /* NAV */

      gsap.from(".navbar", {
        y: -30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
      });

      /* PARALLAX */

      gsap.to(".hero-food-main", {
        y: -90,
        rotate: 8,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-orbit", {
        y: 120,
        rotate: 25,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* WASTE */

      gsap.from(".waste-word", {
        y: 120,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".waste-section",
          start: "top 70%",
        },
      });

      gsap.to(".waste-food", {
        y: -100,
        rotate: 15,
        scrollTrigger: {
          trigger: ".waste-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* STORY */

      gsap.from(".story-card", {
        opacity: 0,
        y: 100,
        stagger: 0.15,
        duration: 1,
        scrollTrigger: {
          trigger: ".story-section",
          start: "top 70%",
        },
      });

      /* MARKET */

      gsap.from(".food-card", {
        opacity: 0,
        y: 80,
        scale: 0.92,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".market-section",
          start: "top 70%",
        },
      });

      /* IMPACT */

      gsap.from(".impact-number", {
        textContent: 0,
        duration: 2,
        snap: {
          textContent: 1,
        },
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".impact-section",
          start: "top 70%",
        },
      });

      /* FINAL */

      gsap.from(".final-title span", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".final-section",
          start: "top 70%",
        },
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [loading]);

  /* -------------------------------------------------------
     CURSOR
  ------------------------------------------------------- */

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) return;

    const move = (event) => {
      gsap.to(cursor, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  /* -------------------------------------------------------
     RESCUE
  ------------------------------------------------------- */

  const handleRescue = (item) => {
    setRescued(item);

    setTimeout(() => {
      setRescued(null);
    }, 2600);
  };

  /* =======================================================
     LOADER
  ======================================================= */

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-top">
          FREEBUFF / FOOD RESCUE
        </div>

        <div className="loader-center">
          <div className="loader-word">
            <span>GOOD.</span>
          </div>

          <div className="loader-word">
            <span>FOOD.</span>
          </div>

          <div className="loader-word loader-final">
            <span>CHANCE.</span>
          </div>
        </div>

        <div className="loader-progress">
          <span />
        </div>

        <div className="loader-bottom">
          SAVING FOOD / ONE BITE AT A TIME
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN WEBSITE
  ======================================================= */

  return (
    <>
      <div ref={cursorRef} className="custom-cursor">
        <span />
      </div>

      <main>
        {/* =================================================
            NAVBAR
        ================================================= */}

        <nav className="navbar">
          <a href="#" className="logo">
            FREE<span>BUFF</span>
          </a>

          <div className="nav-links">
            <a href="#story">WHY</a>
            <a href="#market">RESCUE</a>
            <a href="#impact">IMPACT</a>
          </div>

          <button className="nav-button">
            JOIN THE RESCUE
          </button>
        </nav>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">
          <FoodParticles />

          <div className="hero-kicker">
            <span className="pulse-dot" />
            FOOD RESCUE PLATFORM / INDIA
          </div>

          <div className="hero-copy">
            <div className="hero-line">
              GOOD
            </div>

            <div className="hero-line orange-text">
              FOOD
            </div>

            <div className="hero-line">
              DESERVES
            </div>

            <div className="hero-line red-text">
              ANOTHER
            </div>

            <div className="hero-line">
              CHANCE<span className="period">.</span>
            </div>
          </div>

          <div className="hero-food">
            <div className="hero-food-main">
              <FoodImage
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=90"
                alt="Burger"
              />

              <Steam />
            </div>

            <div className="hero-orbit">
              <span>RESCUE</span>
              <span>DON'T WASTE</span>
              <span>REPEAT</span>
            </div>
          </div>

          <div className="hero-bottom">
            <p>
              Surplus food is still food.
              <br />
              We just give it somewhere better to go.
            </p>

            <a href="#market" className="hero-cta">
              EXPLORE FOOD
              <span>↓</span>
            </a>
          </div>
        </section>

        {/* =================================================
            STEAM
        ================================================= */}

        <section className="steam-section">
          <div className="steam-copy">
            <span className="eyebrow">STILL HOT. STILL GOOD.</span>

            <h2>
              FOOD
              <br />
              SHOULD
              <br />
              <em>MOVE.</em>
            </h2>

            <p>
              Every day restaurants, bakeries and kitchens
              prepare more food than they can sell.
            </p>
          </div>

          <div className="steam-food">
            <FoodImage
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=90"
              alt="Fresh bread"
            />

            <Steam />
          </div>
        </section>

        {/* =================================================
            WASTE
        ================================================= */}

        <section className="waste-section">
          <div className="waste-background-text">
            WASTE
          </div>

          <div className="waste-word-container">
            <span className="waste-word">DON'T</span>
            <span className="waste-word">LET</span>
            <span className="waste-word orange-text">GOOD</span>
            <span className="waste-word">FOOD</span>
            <span className="waste-word red-text">DIE.</span>
          </div>

          <div className="waste-food">
            <FoodImage
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=90"
              alt="Pizza"
            />

            <div className="waste-sticker">
              <span>NOT</span>
              <strong>WASTE</strong>
              <span>IT</span>
            </div>
          </div>

          <div className="waste-caption">
            <span>01</span>
            <p>
              PERFECTLY GOOD FOOD
              <br />
              GETS THROWN AWAY.
            </p>
          </div>
        </section>

        {/* =================================================
            STORY
        ================================================= */}

        <section id="story" className="story-section">
          <div className="section-label">
            <span>02</span>
            THE SECOND LIFE
          </div>

          <div className="story-heading">
            <h2>
              WHAT IF
              <br />
              <span>LEFTOVERS</span>
              <br />
              BECAME
              <br />
              <em>OPPORTUNITY?</em>
            </h2>
          </div>

          <div className="story-grid">
            <article className="story-card story-dark">
              <span>01</span>
              <h3>SURPLUS</h3>
              <p>
                Restaurants list perfectly good food that
                would otherwise go unsold.
              </p>
            </article>

            <article className="story-card story-orange">
              <span>02</span>
              <h3>DISCOVER</h3>
              <p>
                Nearby people discover food at a fraction
                of its original price.
              </p>
            </article>

            <article className="story-card story-purple">
              <span>03</span>
              <h3>RESCUE</h3>
              <p>
                A meal gets another chance instead of
                becoming another waste statistic.
              </p>
            </article>
          </div>
        </section>

        {/* =================================================
            MARKET
        ================================================= */}

        <section id="market" className="market-section">
          <div className="market-top">
            <div>
              <span className="eyebrow">LIVE SURPLUS</span>

              <h2>
                WHAT'S UP
                <br />
                FOR <span>RESCUE?</span>
              </h2>
            </div>

            <p>
              Good food.
              <br />
              Smaller price.
              <br />
              Bigger impact.
            </p>
          </div>

          <div className="food-grid">
            {foodItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onRescue={handleRescue}
              />
            ))}
          </div>
        </section>

        {/* =================================================
            TIME
        ================================================= */}

        <section className="time-section">
          <div className="time-bg">TICK</div>

          <span className="eyebrow">
            FOOD HAS A CLOCK
          </span>

          <h2>
            TIME
            <br />
            IS <span>TASTY.</span>
          </h2>

          <div className="timer-box">
            <div>
              <strong>00</strong>
              <small>HOURS</small>
            </div>

            <b>:</b>

            <div>
              <strong>18</strong>
              <small>MINUTES</small>
            </div>

            <b>:</b>

            <div>
              <strong>42</strong>
              <small>SECONDS</small>
            </div>
          </div>

          <p>
            The faster we rescue it,
            <br />
            the better it gets.
          </p>
        </section>

        {/* =================================================
            IMPACT
        ================================================= */}

        <section id="impact" className="impact-section">
          <div className="impact-intro">
            <span className="eyebrow">
              THE NUMBERS
            </span>

            <h2>
              EVERY
              <br />
              <span>BITE</span>
              COUNTS.
            </h2>
          </div>

          <div className="impact-grid">
            <div className="impact-item">
              <strong className="impact-number">12847</strong>
              <span>MEALS RESCUED</span>
            </div>

            <div className="impact-item">
              <strong className="impact-number">3890</strong>
              <span>KG FOOD SAVED</span>
            </div>

            <div className="impact-item">
              <strong className="impact-number">941</strong>
              <span>ACTIVE RESCUERS</span>
            </div>
          </div>
        </section>

        {/* =================================================
            HOW
        ================================================= */}

        <section className="how-section">
          <div className="section-label">
            <span>03</span>
            HOW IT WORKS
          </div>

          <div className="how-title">
            <h2>
              THREE
              <br />
              MOVES.
            </h2>
          </div>

          <div className="steps">
            <div className="step">
              <span>01</span>
              <div>
                <h3>SPOT IT</h3>
                <p>
                  Find surplus food near you.
                </p>
              </div>
            </div>

            <div className="step">
              <span>02</span>
              <div>
                <h3>CLAIM IT</h3>
                <p>
                  Reserve it before the timer ends.
                </p>
              </div>
            </div>

            <div className="step">
              <span>03</span>
              <div>
                <h3>RESCUE IT</h3>
                <p>
                  Pick it up and give it a second life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section className="final-section">
          <FoodParticles />

          <div className="final-title">
            <span>MAKE</span>
            <span>FOOD</span>
            <span>MATTER</span>
            <span className="red-text">AGAIN.</span>
          </div>

          <button className="final-button">
            START RESCUING
            <span>↗</span>
          </button>

          <div className="final-orbit">
            <span>GOOD FOOD</span>
            <span>GOOD FOOD</span>
            <span>GOOD FOOD</span>
          </div>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer>
          <div className="footer-logo">
            FREE<span>BUFF</span>
          </div>

          <p>
            GOOD FOOD DESERVES ANOTHER CHANCE.
          </p>

          <div className="footer-links">
            <a href="#story">WHY</a>
            <a href="#market">RESCUE</a>
            <a href="#impact">IMPACT</a>
          </div>

          <small>
            © 2026 FREEBUFF — FOOD RESCUE PLATFORM
          </small>
        </footer>
      </main>

      {/* ===================================================
          RESCUE SUCCESS
      =================================================== */}

      {rescued && (
        <div className="rescue-overlay">
          <div className="rescue-success">
            <div className="success-icon">✓</div>

            <span>RESCUE CONFIRMED</span>

            <h2>
              YOU SAVED
              <br />
              <em>{rescued.name}</em>
            </h2>

            <p>
              One less meal wasted.
              <br />
              One more meal enjoyed.
            </p>
          </div>
        </div>
      )}
    </>
  );
}