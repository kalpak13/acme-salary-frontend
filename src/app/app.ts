import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule, MatDrawerMode } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 760px)').pipe(map(({ matches }) => matches)),
    { initialValue: false },
  );
  protected readonly drawerOpen = signal(false);
  protected readonly drawerMode = computed<MatDrawerMode>(() =>
    this.isMobile() ? 'over' : 'side',
  );
  protected readonly drawerOpened = computed(() => !this.isMobile() || this.drawerOpen());

  protected toggleNavigation(): void {
    this.drawerOpen.update((open) => !open);
  }

  protected onNavigationChange(open: boolean): void {
    if (this.isMobile()) {
      this.drawerOpen.set(open);
    }
  }

  protected closeNavigationOnMobile(): void {
    if (this.isMobile()) {
      this.drawerOpen.set(false);
    }
  }
}
