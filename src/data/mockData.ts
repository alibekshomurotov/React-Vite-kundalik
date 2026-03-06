export const classes = ['5-A', '5-B', '6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B', '11-A', '11-B'];

export const subjects = ['Matematika', 'Fizika', 'Kimyo', 'Biologiya', 'Ingliz tili', 'Rus tili', 'Ona tili', 'Tarix', 'Geografiya', 'Adabiyot', 'Informatika', 'Jismoniy tarbiya', 'Musiqa', 'Tasviriy san\'at', 'Algebra', 'Geometriya'];

export const teachersList = [
  { id: 't1', name: 'Aliyev Anvar', subject: 'Matematika' },
  { id: 't2', name: 'Karimova Barno', subject: 'Fizika' },
  { id: 't3', name: 'Rahimov Sherzod', subject: 'Ingliz tili' },
  { id: 't4', name: 'Ismoilova Gulnora', subject: 'Ona tili' },
  { id: 't5', name: 'Nematov Davron', subject: 'Kimyo' },
  { id: 't6', name: 'Toshmatov Zafar', subject: 'Biologiya' },
  { id: 't7', name: 'Usmonova Nigora', subject: 'Tarix' },
  { id: 't8', name: 'Abdullayev Botir', subject: 'Geografiya' },
];

// Har kuni 5-6 ta dars - tasodifiy va xilma-xil
export const generateSchedule = () => {
  const days = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'];
  const schedule = [];
  let id = 1;
  
  for (const classId of classes) {
    for (const day of days) {
      // Har kuni 5 yoki 6 ta dars (tasodifiy)
      const lessonCount = Math.random() > 0.5 ? 5 : 6;
      
      // Tasodifiy fanlarni tanlash (takrorlanmas)
      const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);
      const dailySubjects = shuffledSubjects.slice(0, lessonCount);
      
      for (let i = 0; i < lessonCount; i++) {
        const startHour = 8 + i;
        const endHour = startHour + 1;
        
        schedule.push({
          id: String(id++),
          classId,
          day,
          subject: dailySubjects[i],
          time: `${startHour}:00-${endHour}:45`,
          teacher: teachersList[i % teachersList.length].name
        });
      }
    }
  }
  return schedule;
};

export const scheduleData = generateSchedule();

// Vazifalar - har sinfga 3-4 ta
export const generateHomework = () => {
  const homework = [];
  let id = 1;
  
  for (const classId of classes) {
    const hwCount = 3 + Math.floor(Math.random() * 2); // 3 yoki 4 ta
    
    for (let i = 0; i < hwCount; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const teacher = teachersList.find(t => t.subject === subject) || teachersList[0];
      
      homework.push({
        id: String(id++),
        classId,
        subject,
        title: `${subject} mavzusi bo'yicha vazifa ${i + 1}`,
        description: `${subject} darsidan uyga vazifa. Darslikdan ${20 + i * 5}-${25 + i * 5} betlardagi mashqlarni bajaring.`,
        deadline: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        teacherId: teacher.id,
        teacherName: teacher.name
      });
    }
  }
  return homework;
};

export const homeworkData = generateHomework();

export const gradesData: any[] = [];
export const albumPhotos: any[] = [];