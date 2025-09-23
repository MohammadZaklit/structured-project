import { Component } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'lib-drag-drop',
  imports: [DragDropModule, CommonModule],
  templateUrl: './drag-drop.html',
  styleUrl: './drag-drop.css',
})
export class DragDrop {
  draggedProduct: any = null; // store the item being dragged
  products = [
    { name: 'Laptop', price: 1200 },
    { name: 'Phone', price: 700 },
    { name: 'Headphones', price: 150 },
  ];

  cart: any[] = []; // Dropped items go here

  // Called when drag starts
  dragStart(product: any) {
    this.draggedProduct = product;
  }

  dropdelete(index: number) {
    /* if (this.draggedProduct) {
      this.cart = this.cart.filter((item) => item.name !== this.draggedProduct.name);
      this.draggedProduct = null;
    }*/ // you can use this method when using api data

    this.cart.splice(index, 1);
  }
  // Called when item is dropped
  drop() {
    if (this.draggedProduct) {
      this.cart.push(this.draggedProduct);
    }
  }
}
