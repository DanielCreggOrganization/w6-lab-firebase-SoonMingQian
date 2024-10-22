import { AfterViewInit, Component, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  AlertController, 
  LoadingController, 
  CheckboxCustomEvent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonButtons,
  IonList, 
  IonItemSliding, 
  IonItem, 
  IonLabel,
  IonIcon,
  IonCheckbox, 
  IonItemOptions, 
  IonItemOption, 
  IonModal, 
  IonInput, 
  IonRow, 
  IonCol, 
  IonFab, 
  IonFabButton, 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Observable } from 'rxjs';
import { logOutOutline, pencilOutline, trashOutline, add } from 'ionicons/icons';
import { AuthService } from '../auth.service';
import { TasksService, Task } from '../tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements AfterViewInit{
  newTask!: Task;
  @ViewChild(IonModal) modal!: IonModal;
  tasks$!: Observable<Task[]>;

  private authService = inject(AuthService);
  private tasksService = inject(TasksService);
  private router = inject(Router);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);

  constructor() {}

  ngOnInit(){
    this.resetTask();
    addIcons({ logOutOutline, pencilOutline, trashOutline, add });
    this.tasks$ = this.tasksService.readTasks();
  }

  resetTask() {
    this.newTask = {
      content: '',
      completed: false,
    };
  }

  async logout(){
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async addTask(){
    const loading = await this.loadingController.create();
    await loading.present();
    this.tasksService.createTask(this.newTask);
    await loading.dismiss();
    this.modal.dismiss(null, 'confirm');
    this.resetTask();
  }

  async updateTask(){
    await this.tasksService.updateTask(this.newTask);
    this.resetTask();
  }

  async openUpdateInput(task: Task){
    const alert = await this.alertController.create({
      header: 'Update Task',
      inputs: [
        {
          name: 'Task',
          type: 'text',
          placeholder: 'Task content',
          value: task.content,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Update',
          handler: (data) => {
            task.content = data.Task;
            this.tasksService.updateTask(task);
          }
        },
      ],
    });
    await alert.present();

    setTimeout(() => {
      const firstInput: any = document.querySelector('ion-alert input');
      firstInput.focus();
    }, 250);
  }
}
