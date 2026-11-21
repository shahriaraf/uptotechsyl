/*
  Uptotechsyl, v3: a dark, precise studio site.
  look:  near-black ground, warm off-white ink, one accent (tea green, for Sylhet's tea hills), hairline
         rules and crosshair marks, Geist for words and Geist Mono for every label, index and number.
  3D:    the hero is a three.js point field of rolling tea-garden hills (src/scene/terrain.ts).
  motion: Motion Brew islands (BinaryText labels, FlipWords, MagneticButton, InfiniteGallery,
         BlurAccordion, RotatingText, ContactCard) and the WorkGrid filter; the rest is CSS and
         src/site/behaviours.ts (menu, clock, hover preview, form).
*/
import type { ReactNode } from 'react';
import { founder, makes, nav, prices, services, site, steps, team, work } from './content/site';

const [lead] = team;
import { Island } from './islands/Island';

const pad = (n: number) => String(n).padStart(2, '0');

const mapLink = `https://www.openstreetmap.org/search?query=${encodeURIComponent(
  `${site.address.street} ${site.address.district}`,
)}`;

const Arrow = () => (
  <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M4 10L10 4M5 4h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Logo = () => (
  <a className="logo" href="#top" aria-label={`${site.name}, back to the top`}>
    <img className="logo__mark" src="/images/mark-light.png" alt="" width="26" height="26" />
    <span className="logo__word">{site.name}</span>
  </a>
);

/** the head of every section: a mono index and label on a hairline, then the heading */
/** a round portrait (their own photograph, ringed), the name, then the title */
function Person({ p, lead }: { p: (typeof team)[number]; lead?: boolean }) {
  return (
    <figure className={`person${lead ? ' person--lead' : ''}`}>
      <span className="person__face">
        <img src={`/images/${p.image}-640.webp`} srcSet={`/images/${p.image}-360.webp 360w, /images/${p.image}-640.webp 640w`} sizes="216px" alt="" width={640} height={800} loading="lazy" decoding="async" />
      </span>
      <figcaption>
        <span className="person__name">{p.name}</span>
        <span className="person__role">{p.role}</span>
      </figcaption>
    </figure>
  );
}

function Head({ n, label, id, title, aside }: { n: number; label: string; id: string; title: string; aside?: ReactNode }) {
  return (
    <div className="shead">
      <div className="shead__rule">
        <span className="shead__index">[{pad(n)}]</span>
        <Island name="label" inline props={{ text: label }} className="shead__label" />
        <span className="shead__cross" aria-hidden="true" />
      </div>
      <div className="shead__row">
        <h2 id={id}>
          <Island name="heading" inline props={{ text: title }} />
        </h2>
        {aside && <div className="shead__aside">{aside}</div>}
      </div>
    </div>
  );
}

export function Page() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="hdr" data-hdr>
        <div className="wrap hdr__bar">
          <Logo />
          <nav className="hdr__nav" aria-label="Main">
            {nav.map((n, i) => (
              <a className="hdr__link" href={n.href} key={n.href} data-scramble>
                <span className="hdr__num" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="hdr__end">
            <span className="hdr__clock" aria-hidden="true">
              SYL <span data-clock>--:--</span>
            </span>
            {/* the theme toggle (data-theme-toggle, src/site/behaviours.ts) is off for now; the light palette stays in the CSS */}
            <a className="btn btn--accent hdr__cta" href="#enquiry">
              {site.mainAction}
            </a>
            <button className="hdr__toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle>
              <span className="sr">Menu</span>
              <span className="hdr__burger" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="menu" id="menu" data-menu hidden>
          <nav className="wrap menu__nav" aria-label="Menu">
            {nav.map((n, i) => (
              <a className="menu__link" href={n.href} key={n.href}>
                <span>{pad(i + 1)}</span>
                {n.label}
              </a>
            ))}
            <a className="btn btn--accent menu__cta" href="#enquiry">
              {site.mainAction}
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* HERO: the headline over a 3D line field of Sylhet's tea hills */}
        <section className="hero" id="top" aria-labelledby="hero-h" data-enter>
          <canvas className="hero__scene" data-terrain aria-hidden="true" />
          <div className="hero__grid" aria-hidden="true" />
          <div className="wrap hero__inner">
            <p className="hero__kicker">
              <span className="dot" aria-hidden="true" /> Web design and development studio, Sylhet
            </p>
            <h1 id="hero-h" className="hero__title">
              <span className="line">
                <span>Websites, designed</span>
              </span>
              <span className="line">
                <span>
                  and built in <em>Sylhet.</em>
                </span>
              </span>
            </h1>
            <div className="hero__foot">
              <div className="hero__copy">
                <Island name="makes" props={{ words: makes }} className="hero__makes" />
                <p className="hero__lead">
                  Six designers, developers and SEO specialists. Websites from $199, and you pay only
                  after you approve the finished work.
                </p>
              </div>
              <div className="hero__actions">
                <Island name="cta" props={{ label: site.mainAction, href: '#enquiry' }} className="hero__cta" />
                <a className="btn btn--ghost" href="#work">
                  See the work
                </a>
              </div>
            </div>
          </div>
          <div className="wrap">
            <dl className="hero__stats">
              <div>
                <dt>Websites from</dt>
                <dd>$199</dd>
              </div>
              <div>
                <dt>Paid up front</dt>
                <dd>
                  <Island name="circled" inline props={{ text: '$0' }} />
                </dd>
              </div>
              <div>
                <dt>Specialists</dt>
                <dd>06</dd>
              </div>
              <div>
                <dt>Open Sat to Thu</dt>
                <dd>10:00 to 18:00</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* WORK: art-directed frames of the client's web, UI and SEO projects, filterable */}
        <section className="section" id="work" aria-labelledby="work-h">
          <div className="wrap">
            <Head
              n={1}
              label="Selected work"
              id="work-h"
              title="Shops, sites and dashboards we shipped."
              aside={<p>Open a project to see it full size.</p>}
            />
            <Island name="work" props={{ items: work }} />
          </div>
        </section>

        {/* WALL: print, brand and apparel work on a draggable endless wall */}
        <section className="section section--wall" id="print" aria-labelledby="print-h">
          <div className="wrap">
            <Head
              n={2}
              label="Print and brand"
              id="print-h"
              title="Covers, calendars, logos and tees."
              aside={<p className="mono-hint">Drag the wall</p>}
            />
          </div>
          <Island name="wall" props={{}} className="wall" />
        </section>

        {/* SERVICES: an index of six rows; pointing at one shows its work beside the cursor */}
        <section className="section" id="services" aria-labelledby="services-h">
          <div className="wrap">
            <Head
              n={3}
              label="Services"
              id="services-h"
              title="Six services, one team in one office."
              aside={
                <a className="link" href="#prices">
                  See prices <Arrow />
                </a>
              }
            />
            <ol className="svc" data-preview-list>
              {services.map((s, i) => (
                <li className="svc__row" key={s.name} data-preview={s.image ? `/images/${s.image}-${s.image.startsWith('wall-') ? 520 : 480}.webp` : undefined}>
                  <span className="svc__num">{pad(i + 1)}</span>
                  <h3 className="svc__name">{s.name}</h3>
                  <p className="svc__line">{s.line}</p>
                  <ul className="svc__tags" aria-label={`${s.name} covers`}>
                    {s.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <div className="svc__preview" data-preview aria-hidden="true">
              <img alt="" src={`/images/${services.find((x) => x.image)!.image}-480.webp`} width={480} height={300} loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        {/* PROCESS: three steps on one line */}
        <section className="section" id="process" aria-labelledby="process-h">
          <div className="wrap">
            <Head n={4} label="Process" id="process-h" title="Three steps, each one signed off by you." />
            <ol className="steps">
              {steps.map((s, i) => (
                <li className="step" key={s.title}>
                  <div className="step__track" aria-hidden="true">
                    <span className="step__node" />
                  </div>
                  <span className="step__num">{pad(i + 1)}</span>
                  <h3 className="step__title">{s.title}</h3>
                  <p className="step__line">{s.line}</p>
                  <p className="step__out">
                    <span aria-hidden="true">&rarr;</span> {s.out}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PRICES: three plans, the middle one lit */}
        <section className="section" id="prices" aria-labelledby="prices-h">
          <div className="wrap">
            <Head
              n={5}
              label="Prices"
              id="prices-h"
              title="One-off prices for design and build."
              aside={<p>Paid after you approve the site.</p>}
            />
            <div className="plans">
              {prices.map((p, i) => (
                <article className={`plan ${i === 1 ? 'plan--lit' : ''}`} key={p.name} aria-labelledby={`plan-${i}`}>
                  <div className="plan__top">
                    <h3 className="plan__name" id={`plan-${i}`}>
                      {p.name}
                    </h3>
                    <span className="plan__idx">{pad(i + 1)}/03</span>
                  </div>
                  <p className="plan__value">{p.value}</p>
                  <p className="plan__line">{p.line}</p>
                  <ul className="plan__list">
                    {p.includes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <a className={`btn ${i === 1 ? 'btn--accent' : 'btn--ghost'} plan__btn`} href="#enquiry" data-prefill={`${p.name} website`}>
                    Ask about {p.name}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PROMISE: the payment terms set large */}
        <section className="section promise" id="payment" aria-labelledby="promise-h">
          <div className="wrap promise__inner">
            <h2 id="promise-h" className="promise__title">
              You pay <s className="promise__strike" aria-hidden="true">up front</s> <em>after you approve.</em>
            </h2>
            <div className="promise__side">
              <Island name="badge" props={{}} className="promise__badge" />
              <Island
                name="promise"
                props={{
                  text: 'We send the invoice only after you have checked every page and approved the finished work. Until then, you pay nothing.',
                  mark: 'you pay nothing',
                }}
                className="promise__line"
              />
            </div>
          </div>
        </section>

        {/* TEAM: the heading, the founder with his note, then the five */}
        <section className="section" id="team" aria-labelledby="team-h">
          <div className="wrap">
            <Head
              n={6}
              label="Team"
              id="team-h"
              title="The six people who will build your site."
              aside={<p>Design, development, SEO and project management in one office.</p>}
            />
            <div className="lead">
              <Person p={lead} lead />
              <p className="lead__bio">{founder.bio}</p>
              <a className="link lead__mail" href={`mailto:${site.email}?subject=${encodeURIComponent('A question for Ataur')}`}>
                Email Ataur <Arrow />
              </a>
            </div>
            <ul className="people">
              {team.slice(1).map((t) => (
                <li key={t.name}>
                  <Person p={t} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* QUESTIONS */}
        <section className="section" id="questions" aria-labelledby="questions-h">
          <div className="wrap">
            <div className="faq">
              <div className="faq__intro">
                <Head n={7} label="Questions" id="questions-h" title="Before you ask." />
                <p className="faq__more">
                  Something else? Email{' '}
                  <a className="link" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </p>
              </div>
              <Island name="faq" props={{}} className="faq__list" />
            </div>
          </div>
        </section>

        {/* ENQUIRY: the ways to reach the studio, and the brief form */}
        <section className="section" id="enquiry" aria-labelledby="enquiry-h">
          <div className="wrap">
            <Head n={8} label="Contact" id="enquiry-h" title="Tell us about the project." />
            <div className="contact">
              <div className="contact__side">
                <p className="contact__lead">
                  Tell us what you need and when. We come back with questions or a fixed price, and
                  nothing is billed before you approve the work.
                </p>
                <ul className="ways">
                  <li>
                    <a className="way" href={site.whatsapp}>
                      <img src="/assets/icons/whatsapp.svg" alt="" width="22" height="22" />
                      <span className="way__k">WhatsApp</span>
                      <span className="way__v">Message the studio</span>
                      <Arrow />
                    </a>
                  </li>
                  <li>
                    <a className="way" href={`mailto:${site.email}`}>
                      <img src="/assets/icons/gmail.svg" alt="" width="22" height="18" />
                      <span className="way__k">Email</span>
                      <span className="way__v">{site.email}</span>
                      <Arrow />
                    </a>
                  </li>
                  <li>
                    <a className="way" href={site.phone.href}>
                      <span className="way__dot" aria-hidden="true" />
                      <span className="way__k">Phone</span>
                      <span className="way__v">{site.phone.label}</span>
                      <Arrow />
                    </a>
                  </li>
                  <li>
                    <a className="way" href={mapLink}>
                      <span className="way__dot" aria-hidden="true" />
                      <span className="way__k">Office</span>
                      <span className="way__v">
                        {site.address.street}, {site.address.district}
                      </span>
                      <Arrow />
                    </a>
                  </li>
                </ul>
                <dl className="hours" data-hours data-tz={site.timeZone}>
                  {site.hours.map((h) => (
                    <div key={h.days}>
                      <dt data-days={h.data}>{h.days}</dt>
                      <dd>{h.time}</dd>
                    </div>
                  ))}
                  <p className="hours__now" data-open-now aria-live="polite" />
                </dl>
              </div>

              <form
                id="brief"
                className="form"
                action={`mailto:${site.email}`}
                method="post"
                encType="text/plain"
                data-form
                data-endpoint={site.formEndpoint}
                noValidate
              >
                <div className="field">
                  <label htmlFor="f-name">Your name</label>
                  <input id="f-name" name="name" type="text" autoComplete="name" required aria-describedby="f-name-err" />
                  <p className="field__err" id="f-name-err" hidden>
                    Write the name we should reply to.
                  </p>
                </div>
                <div className="field">
                  <label htmlFor="f-email">Email</label>
                  <input id="f-email" name="email" type="email" autoComplete="email" inputMode="email" required aria-describedby="f-email-err" />
                  <p className="field__err" id="f-email-err" hidden>
                    Write an email address with an @, like name@example.com.
                  </p>
                </div>
                <div className="field field--full">
                  <label htmlFor="f-service">What you need</label>
                  <input id="f-service" name="service" type="text" autoComplete="off" required aria-describedby="f-service-err" placeholder="A new website, SEO, a logo ..." />
                  <p className="field__err" id="f-service-err" hidden>
                    Write the service, for example a new website or SEO.
                  </p>
                </div>
                <div className="field field--full">
                  <label htmlFor="f-brief">About the project</label>
                  <textarea id="f-brief" name="brief" rows={5} required aria-describedby="f-brief-err" />
                  <p className="field__err" id="f-brief-err" hidden>
                    Write a few lines about the project and your deadline.
                  </p>
                </div>
                <div className="form__foot">
                  <button className="btn btn--accent" type="submit">
                    Send the brief <Arrow />
                  </button>
                  <p className="form__status" role="status" data-form-status />
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div className="foot__top">
            <div className="foot__ask">
              Questions first? Ask our founder, <Island name="founder" inline props={{}} />
            </div>
            <a className="btn btn--accent" href="#enquiry">
              {site.mainAction}
            </a>
          </div>
          <div className="foot__cols">
            <div>
              <h3>Studio</h3>
              <ul>
                <li><a href="#work">Work</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#team">Team</a></li>
              </ul>
            </div>
            <div>
              <h3>Working with us</h3>
              <ul>
                <li><a href="#process">Process</a></li>
                <li><a href="#prices">Prices</a></li>
                <li><a href="#questions">Questions</a></li>
              </ul>
            </div>
            <div>
              <h3>Reach us</h3>
              <ul>
                <li><a href={site.whatsapp}>WhatsApp</a></li>
                <li><a href={`mailto:${site.email}`}>Email</a></li>
                <li><a href={site.phone.href}>{site.phone.label}</a></li>
              </ul>
            </div>
          </div>
          <Island name="wordmark" props={{}} className="foot__word" />
          <div className="foot__legal">
            <span>&copy; 2026 {site.name}, {site.address.district}</span>
            <a href="/privacy.html">Privacy</a>
            <a href="#top">Back to top &uarr;</a>
          </div>
        </div>
      </footer>

      <nav className="actionbar" aria-label="Quick actions">
        <a className="btn btn--accent" href="#enquiry">
          {site.mainAction}
        </a>
      </nav>
    </>
  );
}
