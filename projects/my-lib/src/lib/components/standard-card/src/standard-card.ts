import { Component } from '@angular/core';
import { BaseCard } from '@zak-lib/ui-library/elements/base-card';

@Component({
  selector: 'lib-standard-card',
  imports: [BaseCard],
  templateUrl: './standard-card.html',
  styleUrl: './standard-card.css',
})
export class StandardCard {}
