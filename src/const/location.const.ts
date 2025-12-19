export const municipalitiesByDistrict = {
    Thiruvananthapuram: ["Attingal", "Nedumangad", "Neyyattinkara", "Varkala"],
    Kollam: ["Karunagappally", "Kottarakara", "Paravoor", "Punalur"],
    Pathanamthitta: ["Adoor", "Pandalam", "Pathanamthitta", "Thiruvalla"],
    Alappuzha: ["Alappuzha", "Chengannur", "Cherthala", "Haripad", "Kayamkulam", "Mavelikkara"],
    Kottayam: ["Changanassery", "Erattupetta", "Ettumanoor", "Kottayam", "Palai", "Vaikom"],
    Idukki: ["Thodupuzha", "Kattappana"],
    Ernakulam: ["Aluva", "Angamaly", "Eloor", "Kalamassery", "Koothattukulam", "Kothamangalam", "Maradu", "Muvattupuzha", "Paravur", "Perumbavoor", "Piravom", "Thrikkakara", "Thrippunithura"],
    Thrissur: ["Chalakudy", "Chavakkad", "Guruvayoor", "Irinjalakuda", "Kodungallur", "Kunnamkulam", "Wadakanchery"],
    Palakkad: ["Cherpulassery", "Chittur-Thathamangalam", "Mannarkad", "Ottappalam", "Palakkad", "Pattambi", "Shoranur"],
    Malappuram: ["Kondotty", "Kottakkal", "Malappuram", "Manjeri", "Nilambur", "Parappanangadi", "Perinthalmanna", "Ponnani", "Tanur", "Tirur", "Tirurangadi", "Valanchery"],
    Kozhikkode: ["Feroke", "Koduvally", "Koyilandy", "Mukkam", "Payyoli", "Ramanattukara", "Vatakara"],
    Wayanad: ["Kalpetta", "Mananthavady", "Sulthan Bathery"],
    Kannur: ["Anthoor", "Iritty", "Koothuparamba", "Mattannur", "Panoor", "Payyannur", "Sreekandapuram", "Taliparamba", "Thalassery"],
    Kasaragod: ["Kanhangad", "Kasaragod", "Nileshwar"]
} as const;

export type District = keyof typeof municipalitiesByDistrict;
export type Municipality = (typeof municipalitiesByDistrict)[District][number];