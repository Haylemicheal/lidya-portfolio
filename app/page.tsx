"use client";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import ArtworkCard from "@/components/ArtworkCard";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/bg.jpg";
import artistPortrait from "@/assets/artist-2.jpg";
import artwork1 from "@/assets/art1.jpg";
import artwork2 from "@/assets/art2.jpg";
import artwork3 from "@/assets/art3.jpg";
import artwork4 from "@/assets/art4.jpg";
import artwork5 from "@/assets/art5.jpg";
import artwork6 from "@/assets/art6.jpg";
import artwork7 from "@/assets/art7.jpg";
import artwork8 from "@/assets/art8.jpg";
import artwork9 from "@/assets/art9.jpg";
import artwork10 from "@/assets/art10.jpg";
import artwork11 from "@/assets/art11.jpg";
import artwork12 from "@/assets/art12.jpg";
import artwork13 from "@/assets/art13.jpg";
import artwork14 from "@/assets/art14.jpg";

const artworks = [
  {
    image: artwork1,
    title: "The Guardian",
    description:
      "40×50cm oil on canvas. A painting of a solitary figure embodying the role of a protector. The figure's body is represented by a striking vertical column of layered, angular red blocks, suggesting a powerful, almost armored structure. The limbs are long, thin, and dark, giving the form an elegant yet imposing height. The head is a distinct, blue mask-like oval, marked with abstract white and black chevrons that point upward, lending it an air of ritual or authority. The Guardian stands rigidly, holding a long, dark staff that reinforces its role as a watchman or sentry. The figure is set against a background that appears like a dense, abstract forest or a fortified wall, composed of rhythmic horizontal stripes of deep green, overlaid with vertical dashes of yellow and lighter green, creating a textured, geometric pattern that seems to enclose and frame the Guardian, emphasizing its solitary duty within this space.",
  },
  {
    image: artwork2,
    title: "Morning Melody",
    description:
      "20×30cm acrylic on canvas. This small, intimate painting captures the harmonious start to the day through the ritual of coffee making. The central image is a silver Moka pot, rendered with dynamic, visible brushstrokes, positioned over an intense bed of orange and red flames. The atmosphere is defined by the swirling steam, depicted in pale white and gray, which rises rapidly above the pot. This steam acts as the visual carrier for the central symbolic element: musical notes scattered throughout the air. The title highlights how the sounds associated with the pot—the gentle hiss, the perking of the water—are viewed not as mere noise, but as a deliberate, soothing tune accompanying the warming process. The background is a rich, abstract tapestry of deep, interwoven colors creating a cozy yet dramatic setting.",
  },
  {
    image: artwork3,
    title: "The Call of Light",
    description:
      "1×1m oil on canvas. The artwork utilizes the fundamentals of painting—line, color, shape, form, and light and shadow—as a language to convey its essential idea and emotion. The main character is depicted with a strong vertical line form, raising her hands upwards, with a light glow on her face, and dressed in yellow. This imagery represents her readiness to permanently fight her challenges, her victory, her continuous struggle towards the light, and her attainment of complete hope. The challenges she faces are shown with weak, curved lines, indicating they are not greater than her strength. The painting also includes others suffering in deep sorrow and mental trauma, represented by pale blue colors, who are focusing on her path—the exit to the light—demonstrating their transition toward recovery and mental freedom.",
  },
  {
    image: artwork4,
    title: "Sisterhood",
    description:
      "90×45cm oil on canvas. The focus is entirely on the gestures of sisterhood and gentle connection: the central yellow-clad figure tenderly touches the face of the pink-clad figure, suggesting a moment of shared secret, comfort, or deep understanding. In powerful contrast to this warm, internal moment, the background is a dark silhouette of a dense city skyline. This contrast emphasizes the idea that even while surrounded by the impersonal demands of the urban world, these women create their own sanctuary of trust and community. The painting celebrates the quiet power and enduring bonds found in female companionship.",
  },
  {
    image: artwork5,
    title: "The Enduring Flicker of Hope",
    description:
      "40×60cm oil on canvas. This striking portrait powerfully conveys a message of enduring hope and inner strength. A woman with deep, expressive features and dark skin is depicted in a close-up, her gaze direct and unwavering, holding a sense of quiet determination. She is elegantly draped in a flowing white fabric, possibly a traditional shawl or head covering, which creates graceful folds that contrast with the warmth of the central light source. The painting's focal point is the thin, braided candle she holds. Its flame casts an incredibly strong, almost divine orange-yellow glow that radiates outwards, creating a halo of light that illuminates her face and the surrounding space. This intense light symbolizes not just a physical flame, but a metaphorical 'flicker of hope' that persists even in the surrounding deep, mysterious brown shadows of the background.",
  },
  {
    image: artwork6,
    title: "The Nymph's Command of the Cascade",
    description:
      "50×70cm oil on canvas. This vibrant, green-saturated painting portrays a woman as an elemental figure, commanding the forces of nature. Dressed in a flowing, simple white gown, her dark hair billows around her as she stands in a lush garden filled with rich foliage and bright yellow flowers in the foreground. The core of the image is the dazzling stream of water she directs. Instead of passively receiving the water, she actively controls it with her hands, which are adorned with striking gold bangles. The water is painted with brilliant white and light blue-green tones, making it appear crystalline and forceful—a controlled 'cascade.' This visual mastery suggests her role as a 'Nymph' or spirit of the place, where her physical presence and inner power allow her to channel and command the life-giving essence of the environment.",
  },
  {
    image: artwork7,
    title: "Loved Sinner",
    description:
      "30×40cm oil on canvas. This painting reimagines a figure's journey from earthly transgression to divine grace. A solitary figure, cloaked in vibrant orange and blue garments, walks away from the viewer, moving towards an intensely bright, almost ethereal blue light that emanates from beyond a sturdy, arching gateway of textured brown brick. Atop the figure's head rests a woven basket, which in this narrative, symbolically carries the 'fruits of her sins'—a direct echo of the forbidden fruit of Eve. These burdens are carried with her, a visible testament to past failings. However, the powerful light ahead, the clear path through the archway, and the very title 'Loved Sinner' speak to a profound moment of divine forgiveness and acceptance. The journey through the arch is her 'passage into heaven,' leaving the earthly constraints of sin behind as she steps into the glorious, forgiving light.",
  },
  {
    image: artwork8,
    title: "Gravity's Quiet Rebellion",
    description:
      "60×90cm oil on canvas. This striking vertical canvas is a poetic meditation on the theme of freedom and defying limits. The painting features three Black ballerinas, each a testament to grace and resilience, set against a dramatically contrasting abstract background of fiery yellow-orange descending into cool, blue. The title speaks about the figures in flight. Two dancers are captured in poses that completely disregard weight and earthbound rules, symbolizing a total physical and spiritual liberation. They represent the moment where inner strength allows one to transcend the expected constraints of the world. The third dancer, seated in a moment of repose on the blue foreground, embodies the grounded focus and powerful self-possession required before launching into such freedom. The artwork is a unique celebration of the quiet, beautiful defiance inherent in mastering one's form and, through that mastery, achieving complete, unrestricted freedom.",
  },
  {
    image: artwork9,
    title: "Eternal Clasp",
    description:
      "50×60cm acrylic on canvas. This painting is a close-up, intensely focused study on the theme of enduring commitment and union. It features two hands firmly clasped, symbolizing a covenant or unbreakable bond. The title, 'Eternal Clasp,' speaks directly to the promise of permanence suggested by the engagement ring visible on the hand with the long, elegantly manicured nails. This hand, with its pearl bracelet and delicate appearance, contrasts powerfully with the more rugged, broader hand that holds it, highlighting the complementary nature of the two individuals. The hands themselves are rendered in warm, earthly tones, giving them a lifelike intensity. They emerge from and are framed by a rich, abstract background of heavily textured brushstrokes in deep purples and moody browns. This dense, expressive backdrop ensures that the focus remains entirely on the interlocking hands, transforming the simple gesture into a powerful, timeless symbol of love, support, and lasting commitment.",
  },
  {
    image: artwork10,
    title: "Shadowed Intensity",
    description:
      "50×50cm oil on canvas. A powerful exploration of contrast and emotion through the interplay of light and shadow.",
  },
  {
    image: artwork11,
    title: "True Ethiopian Color",
    description:
      "30×30cm oil on canvas. This small, square painting is a vibrant and direct celebration of Ethiopian culture, captured through iconic objects and a bold, declarative color scheme. The Jebena (the traditional Ethiopian coffee pot), depicted in a deep, commanding black. This essential vessel of the coffee ceremony (Buna tetu) is flanked by three small, white coffee cups (Finjal), ready for the communal serving. The composition utilizes simple, dark blue, stylized motifs reminiscent of traditional patterns and decorative arts scattered across the bright field. The painting strips the cultural ritual down to its boldest, most recognizable elements. It is an abstract, folk-art tribute where the powerful yellow, black, and white hues are used to express the essence and identity of a cherished national tradition.",
  },
  {
    image: artwork12,
    title: "Keeper of the Word",
    description:
      "40×50cm oil on canvas. This striking portrait captures the solemn dignity and spiritual authority of a traditional Ethiopian priest. The figure is framed by an intense, overwhelming darkness, from which he emerges holding a large, prominent white Ethiopian hand cross. The composition's tension is generated by the presence of a powerful, luminous yellow-white beam of light that slashes across the dark background from the upper right. This light does not simply illuminate the priest; it seems to emanate from a divine source and falls upon him and the cross, sanctifying his presence. The priest, wearing the customary white robes, turban, and a colorful, heavy cape (green, red, and blue), looks directly at the viewer with a gaze that is both steady and mysterious. He stands as a 'Keeper,' holding the light and the symbol of faith against the deep shadows of the world, serving as a beacon of enduring spiritual presence.",
  },
  {
    image: artwork13,
    title: "The Scream",
    description:
      "An impressionist/Expressionist homage to Edvard Munch's iconic masterpiece, reinterpreting the emotional intensity and psychological depth of the original through a contemporary lens.",
  },
  {
    image: artwork14,
    title: "Starry Night",
    description:
      "An impressionist homage to Vincent van Gogh's celebrated work, capturing the swirling night sky and the emotional resonance of the original through expressive brushwork and vibrant color.",
  },
];

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage.src || heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 text-balance">
            Lidya Alemayehu
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-white/90 font-light">
            Visual Painter
          </p>
          <Button
            onClick={() => scrollToSection("portfolio")}
            variant="secondary"
            size="lg"
            className="gap-2"
          >
            View Portfolio
            <ArrowDown size={20} />
          </Button>
        </div>
        <button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown size={24} />
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 sm:mb-8 text-foreground">
                About Me
              </h2>
              <div className="space-y-4 sm:space-y-5 text-muted-foreground leading-relaxed text-sm sm:text-base">
                <p>
                  My name is Lidya Alemayehu, and I am 26 years old. I grew up in a
                  small city in Northern Ethiopia a close, diverse community
                  where stories were shared openly. From neighbors worrying
                  about school fees, to young people planning uncertain
                  journeys, to women speaking about the risks they took to begin
                  again, I was surrounded by conversations about resilience,
                  struggle, and hope.
                </p>
                <p>
                  I am a visual artist, and my work is deeply rooted in these
                  experiences. I focus on themes related to women, social
                  issues, and community building. With a background in sociology
                  and social anthropology, and years of working in humanitarian
                  settings, I bring a social perspective into every piece I
                  create.
                </p>
                <p>
                  Art has been a part of my life since childhood. As a
                  self-taught artist, I’ve continually developed my craft
                  learning independently and collaborating with different
                  artists to strengthen my skills and broaden my creative
                  expression
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src={artistPortrait}
                  alt="Lidya Alemayehu"
                  className="rounded-lg object-cover shadow-xl "
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 sm:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-6 text-foreground">
              Selected Works
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              A curated collection of recent paintings exploring themes of
              nature, abstraction, and the human experience.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {artworks.map((artwork, index) => (
              <ArtworkCard key={index} {...artwork} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-6 text-foreground">
                Get In Touch
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                I'd love to hear from you about commissions, exhibitions, or
                collaborations.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 bg-foreground text-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base">
            © {new Date().getFullYear()} Lidya Alemayehu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
