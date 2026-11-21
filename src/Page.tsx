/*
  type: service (a web and design agency in Sylhet)
  look: the client's reference (design/reference/agency-dark.jpg): an all-black page, white ink,
        very large light uppercase headlines set on staggered lines, outlined rounded cards in a
        bento grid with one inverted (white) card, numbered discs, white pill buttons with an arrow,
        a row of plain facts, a centred closing offer. Its words, pictures and 3D glass objects are
        not copied: the content is Uptotechsyl's own.
  type: Red Hat Display (light, uppercase headlines) / Red Hat Text
  Motion Brew islands: ProjectIndex in #work, ContactCard in the close
  Each main > section is one screen (--h: 1) unless it says --h: 2 or g2.
*/
import { nav, prices, questions, services, site, srcset, steps, team, work } from './content/site';
import { Island } from './islands/Island';

const Logo = () => (
  <a className="nav__logo" href="#top">
    <img className="nav__mark" src="/images/mark-light.png" alt="" width="28" height="28" />
    {site.name}
  </a>
);

const mapLink = `https://www.openstreetmap.org/search?query=${encodeURIComponent(
  `${site.address.street} ${site.address.district}`,
)}`;

const pad = (n: number) => String(n).padStart(2, '0');

export function Page() {
  return (
    <>
      <header className="nav nav--centre">
        <div className="wrap nav__bar">
          <a className="skip-link" href="#top">
            Skip to content
          </a>
          <Logo />
          <nav className="nav__links" aria-label="Main">
            {nav.map((n) => (
              <div className="nav__item" key={n.href}>
                <a className="nav__link" href={n.href}>
                  {n.label}
                </a>
              </div>
            ))}
          </nav>
          <div className="nav__actions">
            <a className="btn btn--primary" href="#enquiry">
              {site.mainAction}
            </a>
          </div>
          <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <main id="top">
        {/* HERO: the headline set large on staggered lines, the lead and the button under its right half */}
        <section className="hero hero--stagger" data-enter aria-labelledby="hero-h">
          {/* the hero's visual: 3D glass objects (src/scene/glass-scene.ts), drawn behind the .wrap */}
          <canvas className="scene" data-scene="hero" aria-hidden="true" />
          <div className="wrap">
            <div className="hero-text">
              <h1 id="hero-h" className="stagger">
                <span className="stagger__line stagger__line--1">Web design</span>{' '}
                <span className="stagger__line stagger__line--2">and development</span>{' '}
                <span className="stagger__line stagger__line--3">studio in</span>{' '}
                <span className="stagger__line stagger__line--4">Sylhet</span>
              </h1>
              <div className="hero-stagger__foot">
                <p className="hero__lead">
                  We design, build and look after websites from $199, with SEO, graphics and video
                  around them. You pay once you have approved the finished work.
                </p>
                <div className="btn-row">
                  <a className="btn btn--primary" href="#enquiry">
                    {site.mainAction}
                  </a>
                  <a className="btn btn--secondary" href="#work">
                    See our work
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT: a short line about the studio beside three plain facts, then the hero work picture */}
        <section className="section" id="about" aria-labelledby="about-h">
          <div className="wrap">
            <div className="grid grid--top">
              <div className="span-5 stack-6">
                <h2 id="about-h">About the studio</h2>
                <p className="t-lead">
                  Uptotechsyl is a design and development team in Sylhet. We build business sites,
                  online shops and web apps, and handle the SEO, graphics and video that go with
                  them.
                </p>
                <dl className="facts">
                  <div>
                    <dt>Services</dt>
                    <dd>6</dd>
                  </div>
                  <div>
                    <dt>Websites from</dt>
                    <dd>$199</dd>
                  </div>
                  <div>
                    <dt>Paid up front</dt>
                    <dd>$0</dd>
                  </div>
                </dl>
              </div>
              <div className="frame frame--photo span-6 start-7" style={{ ['--ratio' as string]: '100%' }}>
                <img
                  className="frame__img"
                  src="/images/hero-rentifytech-640.webp"
                  alt="The RentifyTech online shop on a desktop, a laptop, a tablet and a phone"
                  loading="lazy"
                  data-source="client"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES: a bento of outlined cards, numbered, the first one inverted */}
        <section className="section" id="services" aria-labelledby="services-h">
          <canvas className="scene" data-scene="services" aria-hidden="true" />
          <div className="wrap">
            <div className="section-head section-head--split">
              <div>
                <h2 id="services-h">Our services</h2>
                <p>Every project is quoted after a short call. Websites start at $199.</p>
              </div>
              <a className="btn btn--secondary" href="#prices">
                See prices
              </a>
            </div>
            <div className="grid bento services-grid">
              {services.map((s, i) => (
                <article className={`bento__card ${i === 0 ? 'bento__card--invert' : ''}`} key={s.name}>
                  <span className="bento__num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <div>
                    <h3>{s.name}</h3>
                    <p>{s.line}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WORK: Motion Brew's project index on the page's split */}
        <section className="section" id="work" aria-labelledby="work-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="work-h">Our portfolio</h2>
              <p>Websites, print and SEO for clients. Point at a project to see it.</p>
            </div>
            <Island name="work" props={{ projects: work.map((w) => ({ ...w, href: w.image })) }} />
          </div>
        </section>

        {/* PROCESS: three outlined cards with a photograph each */}
        <section className="section" id="process" aria-labelledby="process-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="process-h">Our process</h2>
              <p>A website in 3 steps. You approve each one before we start the next.</p>
            </div>
            <div className="grid">
              {steps.map((s, i) => (
                <article className="card card--row span-4" key={s.title}>
                  <span className="bento__num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.line}</p>
                  <div className="panel">
                    <img
                      className="frame__img"
                      src={`/images/${s.image}-${s.widths[0]}.webp`}
                      srcSet={srcset(s.image, s.widths)}
                      sizes="(min-width: 1024px) 410px, 100vw"
                      alt={s.alt}
                      loading="lazy"
                      data-source="client"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PRICES and QUESTIONS: two groups, two screens */}
        <section className="section g2" id="prices" aria-labelledby="prices-h">
          <canvas className="scene" data-scene="prices" aria-hidden="true" />
          <div className="wrap">
            <div className="group">
              <div className="section-head">
                <h2 id="prices-h">Website prices</h2>
                <p>One-off prices for design and build, paid after you approve the site.</p>
              </div>
              <div className="grid price-grid">
                {prices.map((p, i) => (
                  <article className={`bento__card price ${i === 1 ? 'bento__card--invert' : ''}`} key={p.name}>
                    <div>
                      <h3>{p.name}</h3>
                      <p>{p.line}</p>
                    </div>
                    <ul className="price__list">
                      {p.includes.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <div className="price__foot">
                      <p className="price__value">{p.value}</p>
                      <a className="link" href="#brief">
                        Ask about {p.name}
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="group" id="questions">
              <div className="grid grid--top">
                <div className="span-5 stack-4">
                  <h3 className="questions__title">Questions</h3>
                  <p>
                    Something else to ask? Email{' '}
                    <a className="link" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                    .
                  </p>
                </div>
                <div className="faq span-6 start-7">
                  {questions.map((q) => (
                    <div className="faq__item" key={q.q}>
                      <h4>{q.q}</h4>
                      <p>{q.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM: the heading on the left, six portraits on the right */}
        <section className="section" id="team" aria-labelledby="team-h">
          <div className="wrap">
            <div className="grid grid--top">
              <div className="section-head span-5">
                <h2 id="team-h">The team</h2>
                <p>Design, development, SEO and project management, all from one office in Sylhet.</p>
              </div>
              <ul className="people span-6 start-7">
                {team.map((t) => (
                  <li className="people__item" key={t.name}>
                    <img
                      className="people__photo"
                      src={`/images/${t.image}-320.webp`}
                      srcSet={srcset(t.image, t.widths)}
                      sizes="(min-width: 1024px) 200px, 45vw"
                      alt={`Portrait of ${t.name}`}
                      width="320"
                      height="400"
                      loading="lazy"
                      data-source="client"
                    />
                    <p className="people__name">{t.name}</p>
                    <p className="people__role">{t.role}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* OFFER: the reference's centred closing block, with the client's real terms */}
        <section className="section offer statement" id="payment" data-moment="word-highlight" aria-labelledby="offer-h">
          <canvas className="scene" data-scene="payment" aria-hidden="true" />
          <div className="wrap">
            <h2 id="offer-h" className="stagger stagger--centre">
              <span className="stagger__line stagger__line--1">Pay after</span>{' '}
              <span className="stagger__line stagger__line--2">you approve</span>
            </h2>
            <p className="offer__line mo-wh__text">
              We send the invoice only after you have checked every page and approved the finished
              work. Until then, <strong>you pay nothing</strong>.
            </p>
          </div>
        </section>

        {/* ENQUIRY: text and contact ways left, the form in an outlined panel right */}
        <section className="section" id="enquiry" aria-labelledby="enquiry-h">
          <div className="wrap">
            <div className="grid grid--top">
              <div className="span-5 stack-6">
                <div className="section-head">
                  <h2 id="enquiry-h">Contact the studio</h2>
                  <p>
                    Tell us what you need and when. We come back with questions or a fixed price,
                    and nothing is billed before you approve the work.
                  </p>
                </div>
                <div className="contact-facts">
                  <address className="contact-facts__address">
                    {site.address.street}, {site.address.district}
                    <br />
                    <a className="link" href={mapLink}>
                      Get directions
                    </a>
                  </address>
                  <dl className="hours" data-tz={site.timeZone}>
                    {site.hours.map((h) => (
                      <div key={h.days} style={{ display: 'contents' }}>
                        <dt data-days={h.data}>{h.days}</dt>
                        <dd>{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="contact-ways">
                    <li>
                      <img className="ic ic-32" src="/assets/icons/whatsapp.svg" alt="" width="32" height="32" />
                      <a className="link" href={site.whatsapp}>
                        Message us on WhatsApp
                      </a>
                    </li>
                    <li>
                      <img className="ic ic-32 ic-land" src="/assets/icons/gmail.svg" alt="" width="32" height="26" />
                      <a className="link" href={`mailto:${site.email}`}>
                        {site.email}
                      </a>
                    </li>
                    <li>
                      <span className="contact-ways__dot" aria-hidden="true" />
                      <a className="link" href={site.phone.href}>
                        {site.phone.label}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="span-6 start-7 form-panel">
                <form
                  id="brief"
                  className="form"
                  action={`mailto:${site.email}`}
                  method="post"
                  encType="text/plain"
                  data-endpoint={site.formEndpoint}
                  data-sent="Your project brief is in. We will reply by email."
                  noValidate
                >
                  <div className="field">
                    <label htmlFor="f-name">Your name</label>
                    <input id="f-name" name="name" type="text" autoComplete="name" required aria-describedby="f-name-err" />
                    <p className="field__error" id="f-name-err" hidden>
                      Write the name we should reply to.
                    </p>
                  </div>
                  <div className="field">
                    <label htmlFor="f-email">Email</label>
                    <input
                      id="f-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      aria-describedby="f-email-err"
                    />
                    <p className="field__error" id="f-email-err" hidden>
                      Write an email address with an @, like name@example.com.
                    </p>
                  </div>
                  <div className="field field--full">
                    <label htmlFor="f-service">What you need</label>
                    <input id="f-service" name="service" type="text" autoComplete="off" required aria-describedby="f-service-err" />
                    <p className="field__error" id="f-service-err" hidden>
                      Write the service, for example a new website or SEO.
                    </p>
                  </div>
                  <div className="field field--full">
                    <label htmlFor="f-brief">About the project</label>
                    <textarea id="f-brief" name="brief" rows={4} required aria-describedby="f-brief-err" />
                    <p className="field__error" id="f-brief-err" hidden>
                      Write a few lines about the project and your deadline.
                    </p>
                  </div>
                  <div className="btn-row">
                    <button className="btn btn--primary" type="submit">
                      Send the brief
                    </button>
                  </div>
                  <p className="form__status" role="status" data-form-status></p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer closing" id="contact" aria-labelledby="close-h">
        <div className="wrap">
          <div className="closing__cta close--type">
            <div className="section-head">
              <h2 id="close-h">Your next website</h2>
              <div className="t-small muted close__line">
                Questions first? Ask our founder, <Island name="founder" inline props={{}} />
              </div>
            </div>
            <a className="btn btn--primary" href="#enquiry">
              {site.mainAction}
            </a>
          </div>
          <div className="closing__links">
            <div className="grid">
              <div className="span-6 stack-4">
                <Logo />
                <p className="footer__lede">Websites, design and SEO from Sylhet.</p>
              </div>
              <div className="span-3 footer__col">
                <h3>Studio</h3>
                <ul>
                  <li><a href="#about">About</a></li>
                  <li><a href="#services">Services</a></li>
                  <li><a href="#work">Work</a></li>
                  <li><a href="#team">Team</a></li>
                </ul>
              </div>
              <div className="span-3 footer__col">
                <h3>How we work</h3>
                <ul>
                  <li><a href="#process">Process</a></li>
                  <li><a href="#prices">Prices</a></li>
                  <li><a href="#questions">Questions</a></li>
                </ul>
              </div>
            </div>
            <div className="footer__legal">
              <span>
                &copy; 2026 {site.name} &nbsp; <a href="/privacy.html">Privacy</a>
              </span>
              <div className="socials"></div>
            </div>
          </div>
        </div>
      </footer>

      <nav className="actionbar" aria-label="Quick actions">
        <a className="btn btn--primary" href="#enquiry">
          {site.mainAction}
        </a>
      </nav>
    </>
  );
}
