import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PatchInfo } from '../../Models/patch-info';
import { PatchInfoTabs } from '../../Models/Enums/patchtabs-enums';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})

export class AboutPageComponent {


  patchVersion: number[] = [0.000];
  patchInfo: PatchInfo[] = [
    {
      patchVersion: 0.001,
      newFeatures: [
        'First Patch Everything is New!'
      ],
      bugFixes: [
        'First Patch No Bugs Yet'
      ],
      knownIssues:[
        'No known issues'
      ],
      upcomingChanges: [
        'Mobile Release',
        'Diet/Food Tracker/ Calender',
        'Compare Shopping Prices'
      ]
    },
    {
      patchVersion: 0.002,
      newFeatures: [
        'First-ish Patch. Everything is New! Really just testing this page'
      ],
      bugFixes: [
        'First Patch No Bugs Yet but not really'
      ],
      knownIssues: [
        'No known issues, not really'
      ],
      upcomingChanges: [
        'Mobile Release',
        'Mobile Page Support',
        'Diet/Food Tracker/ Calender',
        'Compare Shopping Prices'
      ]
    }
  ]
  currentPatchInfo: PatchInfo = this.patchInfo[0]
  renderedTab: PatchInfoTabs = PatchInfoTabs.newFeatures;
  renderedInfo: string[] = this.currentPatchInfo.newFeatures;

  changePatch(index: number) {
    this.currentPatchInfo = this.patchInfo[index];
    if (this.renderedTab == PatchInfoTabs.bugFixes) {
      this.renderedInfo = this.currentPatchInfo.bugFixes;
    } else if (this.renderedTab == PatchInfoTabs.knownIssues) {
      this.renderedInfo = this.currentPatchInfo.knownIssues;
    } else if (this.renderedTab == PatchInfoTabs.upcomingChanges){
      this.renderedInfo = this.currentPatchInfo.upcomingChanges;
    } else {
      this.renderedInfo = this.currentPatchInfo.newFeatures;
    }
  }

  renderNewFeatures(event: Event) {
    const CurTab = event.target as HTMLButtonElement;
    const AllTabs = document.querySelectorAll('.about-nav-button') as NodeListOf<HTMLButtonElement>
    AllTabs.forEach((tab) => {
      tab.classList.remove('active', 'disabled');
      tab.disabled = false;
    })
    CurTab.classList.add('active', 'disabled');
    CurTab.disabled = true;
    this.renderedTab = PatchInfoTabs.newFeatures;
    this.renderedInfo = this.currentPatchInfo.newFeatures;
  }

  renderBugFixes(event: Event) {
    const CurTab = event.target as HTMLButtonElement;
    const AllTabs = document.querySelectorAll('.about-nav-button') as NodeListOf<HTMLButtonElement>
    AllTabs.forEach((tab) => {
      tab.classList.remove('active', 'disabled');
      tab.disabled = false;
    })
    CurTab.classList.add('active', 'disabled');
    CurTab.disabled = true;
    this.renderedTab = PatchInfoTabs.bugFixes;
    this.renderedInfo = this.currentPatchInfo.bugFixes;
  }

  renderKnownIssues(event: Event) {
    const CurTab = event.target as HTMLButtonElement;
    const AllTabs = document.querySelectorAll('.about-nav-button') as NodeListOf<HTMLButtonElement>
    AllTabs.forEach((tab) => {
      tab.classList.remove('active', 'disabled');
      tab.disabled = false;
    })
    CurTab.classList.add('active', 'disabled');
    CurTab.disabled = true;
    this.renderedTab = PatchInfoTabs.knownIssues;
    this.renderedInfo = this.currentPatchInfo.knownIssues;
  }

  renderUpcomingChanges(event: Event) {
    const CurTab = event.target as HTMLButtonElement;
    const AllTabs = document.querySelectorAll('.about-nav-button') as NodeListOf<HTMLButtonElement>
    AllTabs.forEach((tab) => {
      tab.classList.remove('active', 'disabled');
      tab.disabled = false;
    })
    CurTab.classList.add('active', 'disabled');
    CurTab.disabled = true;
    this.renderedTab = PatchInfoTabs.upcomingChanges;
    this.renderedInfo = this.currentPatchInfo.upcomingChanges;
  }
}
