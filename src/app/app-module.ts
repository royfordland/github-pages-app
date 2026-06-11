import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { App } from './app';

@NgModule({
	declarations: [],
	imports: [BrowserModule, FormsModule, App],
	providers: [provideBrowserGlobalErrorListeners()],
	bootstrap: [App],
})
export class AppModule {}
