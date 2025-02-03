import { Component, AfterViewInit, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  @Output() componentSelected = new EventEmitter<'form' | 'list' | 'chart'>();

  private currentHoveredItem: HTMLElement | null = null; // Track the currently hovered item

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    const menuItems = this.el.nativeElement.querySelectorAll('.menu-item');
    const wee = this.el.nativeElement.querySelector('.wee');


    // Add event listeners for each menu item
    menuItems.forEach((item: HTMLElement) => {
      this.renderer.listen(item, 'click', () => {
        this.setActiveMenuItem(item, wee);  // Update active item and underline
        const itemText = item.textContent?.trim().toLowerCase();
        if (itemText) {
          this.onSelectComponent(itemText as 'form' | 'list' | 'chart');
        }
      });

      // Hover effect to show dash
      this.renderer.listen(item, 'mouseenter', () => this.updateWeePosition(item, wee));
      this.renderer.listen(item, 'mouseleave', () => this.resetWeePosition()); 
    });
  }

  // Method to update active menu item and its position
  private setActiveMenuItem(item: HTMLElement, wee: HTMLElement) {
    const menuItems = this.el.nativeElement.querySelectorAll('.menu-item');
    menuItems.forEach((menuItem: HTMLElement) => {
      this.renderer.removeClass(menuItem, 'current-menu-item'); // Remove previous active class
    });
    this.renderer.addClass(item, 'current-menu-item'); // Add active class to clicked item
    this.updateWeePosition(item, wee); // Update the dash position under the active menu
  }

  // Update position of the underline (wee) when hovering over a menu item
  private updateWeePosition(item: HTMLElement, wee: HTMLElement) {
    if (this.currentHoveredItem !== item) {
      const left = item.offsetLeft;
      const width = item.offsetWidth;
      this.renderer.setStyle(wee, 'left', `${left}px`);
      this.renderer.setStyle(wee, 'width', `${width}px`);
      this.renderer.setStyle(wee, 'visibility', 'visible'); // Make sure the dash is visible
      this.currentHoveredItem = item; // Track the currently hovered item
    }
  }

  // Reset the dash position when mouse leaves, but don't change the position
  private resetWeePosition() {
    // Do nothing when mouse leaves, dash stays at the selected item
  }

  onSelectComponent(component: 'form' | 'list' | 'chart') {
    this.componentSelected.emit(component);
  }
}
