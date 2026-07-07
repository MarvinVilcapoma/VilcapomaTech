import { AfterViewInit, Component, ElementRef, OnDestroy, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { environment } from '../environments/environment';

type NavItem = {
  label: string;
  sectionId: string;
  href: string;
};

type Metric = {
  value: string;
  label: string;
};

type Service = {
  tag: string;
  title: string;
  description: string;
  idealFor: string;
  tone: string;
  benefits: readonly string[];
};

type ContactDetail = {
  label: string;
  value: string;
  href?: string;
};

type ApproachPoint = {
  title: string;
  description: string;
};

@Component({
  selector: 'app-root',
  imports: [FaIconComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private loadingTimer?: ReturnType<typeof setTimeout>;
  private readonly whatsAppNumber = environment.whatsAppNumber;

  protected readonly faWhatsapp = faWhatsapp;
  protected readonly isLoading = signal(true);
  protected readonly isMenuOpen = signal(false);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly brandName = environment.brandName;
  protected readonly slogan = environment.slogan;
  protected readonly ownerName = environment.ownerName;
  protected readonly heroTitle = 'Diseño web profesional para negocios';
  protected readonly heroHighlights = [
    'Landing pages modernas',
    'Tiendas online e-commerce'
  ] as const;

  protected readonly navigation: readonly NavItem[] = [
    { label: 'Inicio', sectionId: 'inicio', href: '#inicio' },
    { label: 'Servicios', sectionId: 'servicios', href: '#servicios' },
    { label: 'Contacto', sectionId: 'contacto', href: '#contacto' }
  ];

  protected readonly headerWhatsAppUrl = this.buildWhatsAppUrl(
    'Hola Marvin, quiero informaci\u00f3n sobre una p\u00e1gina web para mi negocio.'
  );
  protected readonly quoteWhatsAppUrl = this.buildWhatsAppUrl(
    'Hola Marvin, quiero cotizar una p\u00e1gina web para mi negocio.'
  );
  protected readonly contactWhatsAppUrl = this.buildWhatsAppUrl(
    'Hola Marvin, quiero conversar sobre una web para mi negocio.'
  );
  protected readonly floatingWhatsAppUrl = this.buildWhatsAppUrl(
    'Hola Marvin, vi tu web y quiero pedir informaci\u00f3n para mi negocio.'
  );

  protected readonly heroMetrics: readonly Metric[] = [
    {
      value: 'Tu servicio se entiende',
      label: 'la persona capta r\u00e1pido qu\u00e9 haces y por qu\u00e9 podr\u00eda elegirte'
    },
    {
      value: 'Tu marca se ve mejor',
      label: 'la p\u00e1gina se siente m\u00e1s cuidada, m\u00e1s seria y m\u00e1s profesional'
    },
    {
      value: 'El contacto se siente natural',
      label: 'WhatsApp aparece de forma clara, sin forzar y sin hacer ruido'
    }
  ];

  protected readonly heroChecks: readonly string[] = [
    'Explica mejor lo que haces',
    'Refuerza confianza desde el primer vistazo',
    'Deja claro c\u00f3mo contactarte'
  ];

  protected readonly services: readonly Service[] = [
    {
      tag: 'Captaci\u00f3n',
      title: 'Landing pages para vender mejor',
      description:
        'Una p\u00e1gina enfocada en presentar una oferta puntual y llevar a la persona a escribirte.',
      idealFor: 'Para campa\u00f1as, servicios concretos o promociones.',
      tone: '#0b6bcb',
      benefits: [
        'Mensaje principal claro desde el inicio',
        'Secciones que ordenan dudas reales',
        'Botones a WhatsApp bien ubicados',
        'Lectura c\u00f3moda en celular'
      ]
    },
    {
      tag: 'Software',
      title: 'Software web a medida',
      description:
        'Sistemas web pensados seg\u00fan el rubro de tu negocio para ordenar procesos y trabajar con m\u00e1s control.',
      idealFor: 'Para inventarios, manejo de usuarios, reportes, reservas o procesos internos.',
      tone: '#f59e0b',
      benefits: [
        'Se adapta a la forma en que trabaja tu negocio',
        'M\u00f3dulos seg\u00fan tu operaci\u00f3n y tus usuarios',
        'M\u00e1s orden en tareas, registros y seguimiento',
        'Base lista para crecer con nuevas funciones'
      ]
    },
    {
      tag: 'Shopify',
      title: 'E-commerce con Shopify',
      description:
        'Una tienda online pensada para vender con una base s\u00f3lida, buena presentaci\u00f3n de productos y una gesti\u00f3n simple.',
      idealFor: 'Para marcas y negocios que quieren vender online con Shopify.',
      tone: '#2d7a57',
      benefits: [
        'Cat\u00e1logo claro y bien presentado',
        'Proceso simple para comprar o consultar',
        'Base lista para colecciones, promos y medios de pago',
        'Una tienda pensada para crecer sin verse improvisada'
      ]
    }
  ];

  protected readonly approachPoints: readonly ApproachPoint[] = [
    {
      title: 'Atenci\u00f3n directa',
      description: 'Hablas con quien dise\u00f1a y aterriza la propuesta, sin demasiadas vueltas.'
    },
    {
      title: 'Menos relleno',
      description: 'La idea no es llenar la web de palabras, sino hacer que se entienda y funcione.'
    },
    {
      title: 'Enfoque comercial',
      description: 'Cada bloque busca ayudar a que el visitante conf\u00ede y te contacte.'
    }
  ];

  protected readonly contactDetails: readonly ContactDetail[] = [
    {
      label: 'WhatsApp',
      value: environment.whatsAppDisplay
    },
    {
      label: 'Correo',
      value: environment.email,
      href: `mailto:${environment.email}`
    }
  ];

  protected toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected navigateTo(sectionId: string, event?: Event): void {
    event?.preventDefault();
    this.closeMenu();

    window.setTimeout(() => {
      const target = this.host.nativeElement.querySelector(`#${sectionId}`) as HTMLElement | null;
      const header = this.host.nativeElement.querySelector('.site-header') as HTMLElement | null;

      if (!target) {
        return;
      }

      const offset = (header?.offsetHeight ?? 0) + 18;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);

      window.history.replaceState(null, '', `#${sectionId}`);
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }, 0);
  }

  protected buildServiceWhatsAppUrl(serviceTitle: string): string {
    return this.buildWhatsAppUrl(
      `Hola Marvin, quiero consultar sobre el servicio "${serviceTitle}" para mi negocio.`
    );
  }

  private buildWhatsAppUrl(message: string): string {
    const messageParam = encodeURIComponent(message);
    return `https://wa.me/${this.whatsAppNumber}?text=${messageParam}`;
  }

  ngAfterViewInit(): void {
    const container = this.host.nativeElement as HTMLElement;
    const elements = Array.from(container.querySelectorAll('.reveal')) as HTMLElement[];

    this.loadingTimer = setTimeout(() => {
      this.isLoading.set(false);

      const sectionId = window.location.hash.replace('#', '');
      if (sectionId) {
        this.navigateTo(sectionId);
      }
    }, 1050);

    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    elements.forEach((element) => this.observer?.observe(element));
  }

  ngOnDestroy(): void {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }

    this.observer?.disconnect();
  }
}
