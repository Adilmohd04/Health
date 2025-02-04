import { Component, AfterViewInit, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  @Output() componentSelected = new EventEmitter<'form' | 'list' | 'chart'>();

  private currentHoveredItem: HTMLElement | null = null; 

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    const menuItems = this.el.nativeElement.querySelectorAll('.menu-item');
    const wee = this.el.nativeElement.querySelector('.wee');

    menuItems.forEach((item: HTMLElement) => {
      this.renderer.listen(item, 'click', () => {
        this.setActiveMenuItem(item, wee);
        const itemText = item.textContent?.trim().toLowerCase();
        if (itemText) {
          this.onSelectComponent(itemText as 'form' | 'list' | 'chart');
        }
      });

      this.renderer.listen(item, 'mouseenter', () => this.updateWeePosition(item, wee));
      this.renderer.listen(item, 'mouseleave', () => this.resetWeePosition());
    });
  }

  private setActiveMenuItem(item: HTMLElement, wee: HTMLElement) {
    const menuItems = this.el.nativeElement.querySelectorAll('.menu-item');
    menuItems.forEach((menuItem: HTMLElement) => {
      this.renderer.removeClass(menuItem, 'current-menu-item');
    });
    this.renderer.addClass(item, 'current-menu-item');
    this.updateWeePosition(item, wee);
  }

  private updateWeePosition(item: HTMLElement, wee: HTMLElement) {
    if (this.currentHoveredItem !== item) {
      const left = item.offsetLeft;
      const width = item.offsetWidth;
      this.renderer.setStyle(wee, 'left', `${left}px`);
      this.renderer.setStyle(wee, 'width', `${width}px`);
      this.renderer.setStyle(wee, 'visibility', 'visible');
      this.currentHoveredItem = item;
    }
  }

  private resetWeePosition() {
    // Keep the dash at the selected item when mouse leaves
  }

  onSelectComponent(component: 'form' | 'list' | 'chart') {
    this.componentSelected.emit(component);
  }
}
