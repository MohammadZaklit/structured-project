import { Component } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'lib-base-card',
  imports: [Card],
  templateUrl: './base-card.html',
  styleUrl: './base-card.css',
})
export class BaseCard {}
