package database

import (
	"gorm.io/gorm"
)

type SqlHandler interface {
	Count(*int64) *gorm.DB
	Create(interface{}) *gorm.DB
	Delete(interface{}, ...interface{}) *gorm.DB
	Find(interface{}, ...interface{}) *gorm.DB
	First(interface{}, ...interface{}) *gorm.DB
	Group(string) *gorm.DB
	Joins(string, ...interface{}) *gorm.DB
	Model(interface{}) *gorm.DB
	Omit(...string) *gorm.DB
	Save(interface{}) *gorm.DB
	Select(interface{}, ...interface{}) *gorm.DB
	Unscoped() *gorm.DB
	Update(string, interface{}) *gorm.DB
	Updates(interface{}) *gorm.DB
	Where(interface{}, ...interface{}) *gorm.DB
}
