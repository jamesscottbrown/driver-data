library(readxl)
library(reshape2)

spreadsheet <- "Driving-Licence-data-june2017.xlsx" # Obtained from https://data.gov.uk/dataset/driving-licence-data 

## Extract data for "How old are driving licence holders?" section
licence_ages <- read_excel(spreadsheet, sheet="DRL0101-June2017", range="A22:G113", 
                           col_names=c("age", "provisional_male", "provisional_female", "provisional_total", "full_male", "full_female", "full_total"))

write.csv(licence_ages, "licence_age.csv", quote=FALSE, row.names=FALSE)



## Extract data for "How many men and women hold each class of licence?"
class <- read_excel(spreadsheet, sheet="DRL0110-June2017", range="A22:A94", col_names=c("class"))
female <- read_excel(spreadsheet, sheet="DRL0110-June2017", range="C22:C94", col_names=c("female"))
male <- read_excel(spreadsheet, sheet="DRL0110-June2017", range="D22:D94", col_names=c("male"))

licence_classes <- merge(class, female, by.x=0, by.y=0)
licence_classes <- merge(licence_classes, male, by.x=0, by.y=0)
licence_classes[,"Row.names"] <- NULL
licence_classes[,"Row.names"] <- NULL

write.csv(licence_classes, "entitlement-class.csv", quote=c(1), row.names=FALSE)



## Extract data for "How many points do drivers have?"
points <- read_excel(spreadsheet, sheet="DRL0132-June2017", range="C23:AM23", col_names = FALSE)
points <- t(points) # transpose
colnames(points) <- "Points"

frequency <- read_excel(spreadsheet, sheet="DRL0132-June2017", range="C2848:AM2848", col_name=FALSE)
frequency <- t(frequency) # transpose
colnames(frequency) <- "Frequency"

point_frequency <- merge(points, frequency, by.x=0, by.y=0)
point_frequency[,"Row.names"] <- NULL

write.csv(point_frequency, "points-distribution.csv", quote=FALSE, row.names=FALSE) # ???



## Extract data for "How does number of points vary with age?"
female_points <-  read_excel(spreadsheet, sheet="DRL0131 - June2017", range="D25:AN108", col_names=FALSE)
male_points <-  read_excel(spreadsheet, sheet="DRL0131 - June2017", range="D109:AN194", col_names=FALSE)

# NB. female counts start at 16-99
female_provisional <-  read_excel(spreadsheet, sheet="DRL0101-June2017", range="C23:C106", col_names=FALSE)
female_full <- read_excel(spreadsheet, sheet="DRL0101-June2017", range="F23:F106", col_names=FALSE)
female_total <- female_provisional + female_full

# Male points table goes from 15-100
male_provisional <-  read_excel(spreadsheet, sheet="DRL0101-June2017", range="B22:B107", col_names=FALSE)
male_full <- read_excel(spreadsheet, sheet="DRL0101-June2017", range="E22:E107", col_names=FALSE)
male_total <- male_provisional + male_full


normalize <- function(points, total, sex, values){
  mp <- data.matrix(points) # matrix in which rows are age, and column num_points
  mc <- data.matrix(total) # vector of license counts for each age
  normalized <- sweep(mp, 1, mc, '/') # normalized values
  normalized <- normalized * 1000
  
  dimnames(normalized) <- values
  meltR = melt(normalized)
  colnames(meltR) <- c("age", "points", "frequency")
  meltR["sex"] <- sex
  
  return(meltR)
}


normalized_male_points <- normalize(male_points, male_total, "male", list( 15:100, 1:37 ))
normalized_female_points <- normalize(female_points, female_total, "female", list( 16:99, 1:37 ))
all <- rbind(normalized_male_points, normalized_female_points)

write.csv(all, "points.csv", quote=FALSE, row.names=FALSE)



## Extract data for "How does the proportion of provisional licenses differ between districts?"
license_districts <- read_excel(spreadsheet, sheet="DRL0102-June2017", range="A12:G3235", 
                           col_names=c("district", "provisional_male", "provisional_female", "provisional_total", "full_male", "full_female", "full_total"))

write.csv(license_districts, "licence-districts.csv", quote=FALSE, row.names=FALSE)


## Extract for "How does the proportion of people with points on their license differ between districts?"
districts <- read_excel(spreadsheet, sheet="DRL0132-June2017", range="A25:A2847", col_names=c('district'))
num_people_with_points <- read_excel("Driving-Licence-data-june2017.xlsx", sheet="DRL0132-June2017", range="AN25:AN2847", col_names=c('people_with_points'))
a <- merge(districts, num_people_with_points, by.x=0, by.y=0)

license_totals <- license_districts[,c("district","provisional_total", "full_total")] 
b <- merge(a, license_totals, by="district")
b["proportion_with_points"] <- b[,"people_with_points"] / (b[,"provisional_total"] + b[,"full_total"])
b <- b[,c("district","proportion_with_points")] 

write.csv(b, "points-districts.csv", quote=FALSE, row.names=FALSE)

